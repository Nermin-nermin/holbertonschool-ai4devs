# Risk Assessment - Legacy COBOL Banking Transaction System (`ACCT-TRANSACTION`)

Severity scale:
- **High**: can lose money or data, or cause an outage, and needs fixing before or during migration.
- **Medium**: makes changes risky or slow.
- **Low**: makes code harder to maintain or debug.

| # | Risk | Severity | Notes |
|---|---|---|---|
| 1 | Race condition on balance updates (no row lock between read and update) | High | `VALIDATE-ACCOUNT` reads `BALANCE` with a plain `SELECT`; the withdrawal is authorised on that value and the balance is updated later. Two withdrawals at the same moment can both pass the check, leading to overdraft and lost updates at ~50M transactions/day. |
| 2 | Database errors treated as "invalid account" | High | Any `SQLCODE ≠ 0` (including negative codes for deadlocks or DB2 outages) just leaves the account flag at `'N'`. Outages look like customer errors and are never alerted. |
| 3 | Data inconsistency during migration (5-minute sync window) | High | The Strangler Fig setup copies DB2 data to the new database every 5 minutes. Any legacy write to a migrated account can overwrite balances changed by the Java service. Two sources of truth for money. |
| 4 | Missing / undocumented business logic | High | `CHECK-TRANSFER-LIMITS`, `UPDATE-ACCOUNT-BALANCE` and `LOG-TRANSACTION` are called but not in the analysed source. The Java `processTransfer` is also missing. Transfer rules could be lost in migration. |
| 5 | No automated tests for the legacy program | High | Behaviour can't be verified before refactoring. Characterization tests (record inputs and outputs from production and replay them against Java) are needed before switching any account. |
| 6 | Balance update and audit log not in one transaction | Medium | `UPDATE-ACCOUNT-BALANCE` and `LOG-TRANSACTION` run as separate steps with no visible `COMMIT`/rollback. A crash between them leaves a changed balance with no audit record, which is a compliance issue. |
| 7 | Hardcoded business rules | Medium | The single-withdrawal limit `5000.00` is a literal, identical for all account types, and there is no daily cumulative limit. Changing it needs a COBOL change and a mainframe redeploy. |
| 8 | Unknown transaction types silently rejected | Medium | `EVALUATE WS-TXN-TYPE` has no `WHEN OTHER`. Corrupted or new type codes are rejected with no reason or log. Deposits also have no amount checks. |
| 9 | Data type limits (unsigned, fixed-width fields) | Medium | `PIC 9(10)V99` can't hold negative balances, so overdraft and credit accounts need special handling. The `PIC X(14)` timestamp is a string with no time zone. Values must be mapped carefully to `BigDecimal` and `LocalDateTime`. |
| 10 | COBOL/DB2 skills shortage and sparse documentation | Medium | Few engineers can safely change or explain the system, so knowledge is concentrated in a few people. |
| 11 | Generic exception handling in the Java port | Low | `catch (Exception e)` turns specific failures (e.g. inactive account) into "Transaction processing failed". Harder support and worse customer messages. |
| 12 | Flag variables and nested `IF`s | Low | `'Y'`/`'N'` flags set in other paragraphs make the control flow hard to follow and test; use `88`-level names or guard clauses. |

## Top priorities
1. **Risks 1 and 2.** Add `SELECT … FOR UPDATE` (or optimistic locking in JPA), and separate "not found" (`SQLCODE 100`) from real DB errors with alerting.
2. **Risks 4 and 5.** Recover the missing paragraphs and write characterization tests from production traffic before migrating any account.
3. **Risk 3.** Use a single writer per account and change-data-capture instead of a 5-minute batch sync, and run the Java service in shadow mode before switching.
