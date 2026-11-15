# Codebase Overview - Legacy COBOL Banking Transaction System (`ACCT-TRANSACTION`)

Source: the course's *Legacy COBOL System Modernization* example. It is a mainframe COBOL program that validates and posts account transactions, being migrated to Java Spring microservices.

## Purpose
Processes three transaction types against customer accounts:
- `WD`: withdrawal
- `DP`: deposit
- `TR`: transfer

Flow: validate the account (must exist and have status `A` = active) → validate the transaction by type → update the balance and log, or reject.

## Age
- Classic mainframe COBOL style: fixed `PIC` record layouts, `PERFORM` paragraphs, embedded `EXEC SQL` against DB2, and `Y`/`N` character flags instead of booleans or `88`-level condition names.
- This style is typical of banking systems written from the 1980s to the early 2000s. The example gives no exact first-release date, so the age is an estimate (20+ years). It is still in production: the system processes **~50 million transactions per day**.
- Modernization plan: an **18-month phased migration** to Java Spring, using the Strangler Fig pattern.

## Size
| Part | Size |
|---|---|
| `ACCT-TRANSACTION` program excerpt analysed | ~80 LOC of COBOL (DATA DIVISION ~20 lines, PROCEDURE DIVISION ~60 lines) |
| Paragraphs | 7 shown: `MAIN-PROCESS`, `INITIALIZE-PROGRAM`, `PROCESS-TRANSACTION`, `VALIDATE-ACCOUNT`, `VALIDATE-TRANSACTION`, `CHECK-WITHDRAWAL-LIMITS`, plus 6 referenced but not included (`CHECK-TRANSFER-LIMITS`, `UPDATE-ACCOUNT-BALANCE`, `LOG-TRANSACTION`, `REJECT-TRANSACTION`, `REJECT-INVALID-ACCOUNT`, `CLEANUP-PROGRAM`) |
| Data structures | 3 working-storage records: `WS-ACCOUNT-RECORD`, `WS-TRANSACTION-RECORD`, `WS-VALIDATION-FLAGS` |
| Full system | Not published. A core banking mainframe of this kind usually has hundreds of programs, copybooks and JCL jobs, so this module is one small piece. |

## Main Dependencies
- **IBM mainframe COBOL** runtime (z/OS)
- **DB2** relational database: table `ACCOUNTS` (`ACCT_NUMBER`, `BALANCE`, `STATUS`, `TYPE`), accessed through embedded SQL with `SQLCODE` checks
- Batch/online scheduling (JCL/CICS) to feed transactions in (not shown)
- **During migration:**
  - Java 17+ / Spring Boot (JPA/Hibernate, `@Transactional`)
  - A `CobolServiceAdapter` bridge
  - A scheduled DB2 → new-database sync job (every 5 minutes)
  - A feature-toggle service that routes each account to the old or new system

## Data Model (key fields)
| Field | COBOL type | Meaning |
|---|---|---|
| `WS-ACCT-NUMBER` | `PIC 9(10)` | 10-digit account number |
| `WS-ACCT-BALANCE` | `PIC 9(10)V99` | Unsigned balance, 2 implied decimals (cannot hold a negative value) |
| `WS-ACCT-STATUS` | `PIC X(1)` | `A` = active |
| `WS-TXN-TYPE` | `PIC X(2)` | `WD` / `DP` / `TR` |
| `WS-TXN-AMOUNT` | `PIC 9(8)V99` | Unsigned, max 99,999,999.99 |
| `WS-TXN-TIMESTAMP` | `PIC X(14)` | Timestamp stored as a 14-character string (`YYYYMMDDHHMMSS`) |

## Known Issues / Pain Points
- **No automated tests.** Business rules are only verifiable by running the mainframe job. The Java port is the first place unit and integration tests appear.
- **Missing or undocumented paragraphs.** `CHECK-TRANSFER-LIMITS` is called for `TR` but its logic is not in the source provided, and neither are the balance update and logging steps.
- **Hardcoded business rules.** The withdrawal limit of `5000.00` is a literal in the code, and there is no daily limit.
- **Silent rejections.** An unknown transaction type has no `WHEN OTHER` branch, and any `SQLCODE` other than 0 (not found or a real DB error) is treated as an "invalid account".
- **Concurrency.** The balance is read with a plain `SELECT` and updated later, with no visible row lock or commit handling. That is risky at 50M transactions per day.
- **Deep nesting and flag variables.** `IF` inside `IF` with `'Y'`/`'N'` flags makes the control flow hard to follow and test.
- **Knowledge risk.** Few developers still know COBOL and DB2, and documentation is sparse.
- **Migration complexity.** Running two systems in parallel (Strangler Fig) with a 5-minute data sync creates a window where the two copies of a balance disagree.
