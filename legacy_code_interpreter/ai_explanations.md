# AI Explanations of Complex Code - `ACCT-TRANSACTION` (COBOL) and its Java port

Five sections I found hard to read were explained with an AI assistant. Each explanation below was checked against the code, and each section lists the problems found and suggested improvements.

---

## Section 1 – `PROCESS-TRANSACTION` (main control flow)
```cobol
PROCESS-TRANSACTION.
    PERFORM VALIDATE-ACCOUNT
    IF WS-ACCOUNT-VALID = 'Y'
        PERFORM VALIDATE-TRANSACTION
        IF WS-TXN-AUTHORIZED = 'Y'
            PERFORM UPDATE-ACCOUNT-BALANCE
            PERFORM LOG-TRANSACTION
        ELSE
            PERFORM REJECT-TRANSACTION
        END-IF
    ELSE
        PERFORM REJECT-INVALID-ACCOUNT
    END-IF.
```
- **Plain English**: First check that the account exists and is active. If it is, check whether this transaction is allowed. If it is allowed, change the balance and write a log record. Otherwise reject the transaction. If the account itself is invalid, reject with a different reason.
- **Pattern**: Nested `IF` blocks driven by `'Y'`/`'N'` flag variables set in other paragraphs (shared global state).
- **Issues**:
  - The flags are set as side effects of other paragraphs, so you must read 3 paragraphs to know what one `IF` means.
  - Balance update and logging are two separate steps with no visible commit/rollback. If logging fails, the balance has already changed.
- **Improvements**:
  - Use `88`-level condition names (`88 ACCOUNT-IS-VALID VALUE 'Y'`) or, in Java, guard clauses with early return.
  - Wrap update and log in one unit of work (`EXEC SQL COMMIT` / Spring `@Transactional`).

---

## Section 2 – `VALIDATE-ACCOUNT` (embedded SQL)
```cobol
EXEC SQL
    SELECT ACCT_NUMBER, BALANCE, STATUS, TYPE
    INTO :WS-ACCT-NUMBER, :WS-ACCT-BALANCE, :WS-ACCT-STATUS, :WS-ACCT-TYPE
    FROM ACCOUNTS
    WHERE ACCT_NUMBER = :WS-ACCT-NUMBER
END-EXEC
IF SQLCODE = 0
    IF WS-ACCT-STATUS = 'A'
        MOVE 'Y' TO WS-ACCOUNT-VALID
    END-IF
END-IF.
```
- **Plain English**: Look up the account row in DB2 using the account number, copy its balance, status and type into working storage, and mark the account valid only if the row was found **and** the status is `A` (active).
- **Pattern**: Embedded SQL with host variables (`:WS-…`); the same variable `WS-ACCT-NUMBER` is both the search key and an output.
- **Issues**:
  - `SQLCODE` `100` (not found) and negative codes (real database errors, e.g. a deadlock) are treated the same way, so a DB outage looks like "invalid account" to the customer and is never alerted.
  - No `FOR UPDATE` lock, although the balance read here is later used to authorise a withdrawal.
  - The program never shows where `WS-ACCT-NUMBER` is filled from the input; there's no `LINKAGE SECTION` or `ACCEPT` in the excerpt.
- **Improvements**:
  - Handle `SQLCODE = 100` → "account not found" and `SQLCODE < 0` → log, alert and abend/retry.
  - Read with `SELECT … FOR UPDATE` (or optimistic locking with a version column in JPA).
  - Pass the input through a documented `LINKAGE SECTION` record.

---

## Section 3 – `VALIDATE-TRANSACTION` (`EVALUATE` dispatch)
```cobol
EVALUATE WS-TXN-TYPE
    WHEN 'WD' PERFORM CHECK-WITHDRAWAL-LIMITS
    WHEN 'DP' MOVE 'Y' TO WS-TXN-AUTHORIZED
    WHEN 'TR' PERFORM CHECK-TRANSFER-LIMITS
END-EVALUATE.
```
- **Plain English**: Decide how to approve the transaction based on its 2-letter type. Withdrawals and transfers need limit checks; deposits are always approved.
- **Pattern**: `EVALUATE` is COBOL's `switch`; each branch sets the shared authorisation flag.
- **Issues**:
  - There's no `WHEN OTHER`, so an unknown or corrupted type (e.g. `'XX'`) leaves the flag at `'N'` and is rejected with no reason recorded.
  - Deposits are approved with no checks at all: no zero-amount check and no anti-money-laundering threshold.
  - `CHECK-TRANSFER-LIMITS` is called but not present in the source analysed.
- **Improvements**:
  - Add `WHEN OTHER` that logs and rejects with an error code.
  - Model types as an enum (`TransactionType` in Java) so invalid values cannot exist.
  - Add amount > 0 and large-deposit checks.
  - Locate and document the transfer rules before migrating.

---

## Section 4 – `CHECK-WITHDRAWAL-LIMITS` (business rule)
```cobol
IF WS-ACCT-BALANCE >= WS-TXN-AMOUNT
    IF WS-TXN-AMOUNT <= 5000.00
        MOVE 'Y' TO WS-TXN-AUTHORIZED
    END-IF
END-IF.
```
- **Plain English**: Approve a withdrawal only if the account has at least that much money **and** the amount is at most 5,000.00 in a single transaction.
- **Pattern**: Hardcoded business rule inside nested `IF`s; implied decimals (`V99`) make `5000.00` a fixed-point comparison.
- **Issues**:
  - The 5,000 limit is a literal, so changing it needs a code change and redeploy.
  - It's the same limit for every account type (checking, savings, credit).
  - There's no daily cumulative limit, so 10 × 5,000 in a row is allowed.
  - Because both checks are folded into one flag, the customer can't be told *which* rule failed.
- **Improvements**:
  - Move limits to configuration or a rules table per account type (the Java version does this with `BusinessRulesService.getTransactionLimit(type)`).
  - Add a daily-total check.
  - Return a specific reason code per failed rule.

---

## Section 5 – Java Strangler Fig routing and data sync
```java
if (featureToggleService.isAccountMigrated(request.getAccountNumber())) {
    result = modernService.processTransaction(request);
} else {
    result = legacyService.processTransaction(request);   // COBOL via adapter
}

@Scheduled(cron = "0 */5 * * * *")   // every 5 minutes
public void syncAccountData() { ... legacy DB2 → modern DB ... }
```
- **Plain English**: Each request is sent to either the new Java service or the old COBOL program, depending on whether that account has been migrated yet. Every 5 minutes, a job copies migrated accounts' data from the old DB2 database into the new database.
- **Pattern**:
  - Strangler Fig, which replaces the old system gradually, behind a facade.
  - Feature toggles per account.
  - Batch synchronisation.
- **Issues**:
  - For up to 5 minutes the two databases disagree. If anything still writes to DB2 for a migrated account (batch jobs, other COBOL programs), the sync overwrites balances changed by the Java service. That means lost updates or double spending.
  - `processTransaction` catches generic `Exception`, so an `InactiveAccountException` becomes the vague "Transaction processing failed".
  - `processTransfer` is called but not shown, which mirrors the missing COBOL paragraph.
- **Improvements**:
  - Make one system the **single writer** per account. Freeze legacy writes for a migrated account and replace the 5-minute batch with change-data-capture (CDC).
  - Catch specific exceptions.
  - Run both implementations in parallel ("shadow mode") and compare results before switching each account.

---

## How the AI was used
For each section I gave the AI the code and asked: *"Explain this in plain English for someone who doesn't know COBOL, then list hidden assumptions, bugs and risks."* I checked every claim against the code. For example, the AI first said deposits were "validated"; reading the `EVALUATE` showed they are approved with no checks, so I corrected it.
