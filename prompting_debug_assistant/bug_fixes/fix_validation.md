# Fix Validation

Each fixed file contains its own test cases (Python `assert`, JavaScript checks that `throw` on failure, and C `PASS`/`FAIL` checks with a non-zero exit code) and prints `All tests passed` only if every case passes.

**How the tests were run**:
- Python: `python3 bugN_fixed.py` (Python 3.11)
- JavaScript: `gjs bugN_fixed.js` (SpiderMonkey JavaScript engine; Node.js was not installed)
- C: `gcc -Wall -Werror -Wextra -pedantic bug5_fixed.c -lm -o bug5_fixed && ./bug5_fixed`

| File | Runs without errors | Test cases passed |
|---|---|---|
| bug1_fixed.py | ✅ | 6 / 6 |
| bug2_fixed.js | ✅ | 6 / 6 |
| bug3_fixed.py | ✅ | 4 / 4 |
| bug4_fixed.js | ✅ | 1 / 1 |
| bug5_fixed.c | ✅ | 5 / 5 |
| bug6_fixed.py | ✅ | 4 / 4 |

## Bug 1 – bug1_fixed.py
**Fix applied**: Replaced the loop with `return items[-n:]` (keeping the `n <= 0` guard).  
**Manual tweaks beyond AI suggestion**: Yes. The AI's first suggestion, `range(len(items) - n, len(items))`, fixed the off-by-one but failed when `n > len(items)` (wrong output for `n = 7`, `IndexError` on an empty list). The alternative `items[-n:]`, which also came from the AI, was used instead.
- **Input**: [10, 20, 30, 40, 50], n=2  
- **Expected Output**: [40, 50]  
- **Actual Output**: [40, 50] ✅
- **Input**: [10, 20, 30, 40, 50], n=5  
- **Expected Output**: [10, 20, 30, 40, 50]  
- **Actual Output**: [10, 20, 30, 40, 50] ✅
- **Input**: [1, 2, 3, 4, 5], n=3  
- **Expected Output**: [3, 4, 5]  
- **Actual Output**: [3, 4, 5] ✅
- **Input**: [10, 20, 30, 40, 50], n=0  
- **Expected Output**: []  
- **Actual Output**: [] ✅
- **Input**: [10, 20, 30, 40, 50], n=7 (n larger than the list)  
- **Expected Output**: [10, 20, 30, 40, 50]  
- **Actual Output**: [10, 20, 30, 40, 50] ✅
- **Input**: [], n=3 (empty list)  
- **Expected Output**: []  
- **Actual Output**: [] ✅

## Bug 2 – bug2_fixed.js
**Fix applied**: Changed `year % 400 !== 0` to `year % 400 === 0`.  
**Manual tweaks beyond AI suggestion**: None to the fix. Two extra test years (2100, 2400) were added, plus a `throw` so that a failing case stops the script.
- **Input**: 2024  
- **Expected Output**: true  
- **Actual Output**: true ✅
- **Input**: 2023  
- **Expected Output**: false  
- **Actual Output**: false ✅
- **Input**: 1900  
- **Expected Output**: false  
- **Actual Output**: false ✅
- **Input**: 2000  
- **Expected Output**: true  
- **Actual Output**: true ✅
- **Input**: 2100  
- **Expected Output**: false  
- **Actual Output**: false ✅
- **Input**: 2400  
- **Expected Output**: true  
- **Actual Output**: true ✅

## Bug 3 – bug3_fixed.py
**Fix applied**: `average()` now returns `0.0` for an empty list: `return sum(values) / len(values) if values else 0.0`.  
**Manual tweaks beyond AI suggestion**: None. The docstring was updated to mention the empty-list case.
- **Input**: alice → [120.0, 80.5, 42.0]  
- **Expected Output**: `alice  3 orders, average 80.83`  
- **Actual Output**: `alice  3 orders, average 80.83` ✅
- **Input**: bob → [15.0]  
- **Expected Output**: `bob    1 orders, average 15.00`  
- **Actual Output**: `bob    1 orders, average 15.00` ✅
- **Input**: carol → [] (no orders; previously crashed)  
- **Expected Output**: `carol  0 orders, average 0.00`  
- **Actual Output**: `carol  0 orders, average 0.00` ✅
- **Input**: dave → [60.0, 40.0] (previously never reached)  
- **Expected Output**: `dave   2 orders, average 50.00`  
- **Actual Output**: `dave   2 orders, average 50.00` ✅

## Bug 4 – bug4_fixed.js
**Fix applied**: Added the missing `)` in the loop header: `for (const item of items) {`.  
**Manual tweaks beyond AI suggestion**: `printReceipt()` now also returns the total so it can be checked automatically. The printed output is unchanged.
- **Input**: cart = Notebook (3.50 × 4), Pen (1.20 × 10), Backpack (25.00 × 1)  
- **Expected Output**:
  ```
  Notebook   x4  14.00
  Pen        x10  12.00
  Backpack   x1  25.00
  ------------------------
  TOTAL              51.00
  ```
- **Actual Output**: identical to expected, no `SyntaxError` ✅

## Bug 5 – bug5_fixed.c
**Fix applied**: Cast to `double` before dividing: `return ((double)passed / total * 100);`  
**Manual tweaks beyond AI suggestion**: `main()` was turned into a small test runner (a `check()` helper using `fabs` for floating-point comparison, linked with `-lm`). It returns `1` if any case fails. Compiles with no warnings under `-Wall -Werror -Wextra -pedantic`.
- **Input**: passed=29, total=40  
- **Expected Output**: 72.5%  
- **Actual Output**: 72.5% ✅
- **Input**: passed=18, total=24  
- **Expected Output**: 75.0%  
- **Actual Output**: 75.0% ✅
- **Input**: passed=30, total=30  
- **Expected Output**: 100.0%  
- **Actual Output**: 100.0% ✅
- **Input**: passed=0, total=25  
- **Expected Output**: 0.0%  
- **Actual Output**: 0.0% ✅
- **Input**: passed=5, total=0 (division-by-zero guard)  
- **Expected Output**: 0.0%  
- **Actual Output**: 0.0% ✅

## Bug 6 – bug6_fixed.py
**Fix applied**: Replaced `scores.sort(...)` with `return sorted(scores, reverse=True)[:3]`.  
**Manual tweaks beyond AI suggestion**: None. Added a check that the original list is not modified, plus two edge cases.
- **Input**: [420, 1337, 88, 999, 512, 64]  
- **Expected Output**: [1337, 999, 512]  
- **Actual Output**: [1337, 999, 512] ✅
- **Input**: original list after the call  
- **Expected Output**: [420, 1337, 88, 999, 512, 64] (unchanged)  
- **Actual Output**: [420, 1337, 88, 999, 512, 64] ✅
- **Input**: [5, 1] (fewer than 3 scores)  
- **Expected Output**: [5, 1]  
- **Actual Output**: [5, 1] ✅
- **Input**: [] (empty list)  
- **Expected Output**: []  
- **Actual Output**: [] ✅
