# Bug Reports

Formal reports for the six bugs in `bug_snippets/`, fixed in `bug_fixes/`.
Details of the AI prompts are in `bug_snippets/ai_debug_log.md`, and the test cases are in `bug_fixes/fix_validation.md`.

**Legend**: 🤖 AI-generated suggestion · ✋ manual edit or decision

| Bug | File | Type | Status |
|---|---|---|---|
| 1 | bug1.py | Off-by-one | Fixed ✅ |
| 2 | bug2.js | Logical error | Fixed ✅ |
| 3 | bug3.py | Runtime exception | Fixed ✅ |
| 4 | bug4.js | Syntax error | Fixed ✅ |
| 5 | bug5.c | Misuse of data types | Fixed ✅ |
| 6 | bug6.py | Misuse of library/built-in | Fixed ✅ |

## Bug Report – bug1.py
- **File**: `bug_snippets/bug1.py` → fixed in `bug_fixes/bug1_fixed.py`  
- **Summary**: Off-by-one error in the loop. `last_n()` always returned one item fewer than requested (`[50]` instead of `[40, 50]`).  
- **Root Cause**: The loop started at `len(items) - n + 1` instead of `len(items) - n`, skipping the first wanted element.  
- **Resolution**:
  - 🤖 AI suggested changing the start index to `len(items) - n`, and also offered `items[-n:]` as an alternative.
  - ✋ Testing showed the first suggestion still failed when `n > len(items)` (wrong output for `n = 7`, `IndexError` on an empty list), so the AI's alternative `items[-n:]` was chosen instead. Six test cases were added with `assert`.
- **Lesson Learned**: Always test edge cases (zero, larger than the list, an empty list) even after the reported case is fixed. Prefer a built-in slice to manual index arithmetic.

**Before → After**
```python
for i in range(len(items) - n + 1, len(items)):   # before
    result.append(items[i])

return items[-n:]                                   # after
```

## Bug Report – bug2.js
- **File**: `bug_snippets/bug2.js` → fixed in `bug_fixes/bug2_fixed.js`  
- **Summary**: Logical error in the leap-year rule. Century years were wrong: 1900 was reported as a leap year and 2000 was not.  
- **Root Cause**: The 400-year exception was inverted: `year % 400 !== 0` was used where the rule needs `year % 400 === 0`. Ordinary years hid the bug, because `year % 100 !== 0` already made them correct.  
- **Resolution**:
  - 🤖 AI identified the inverted comparison and suggested flipping `!==` to `===`. It also offered two equivalent rewrites, which were tested and all passed.
  - ✋ The one-character AI fix was kept. Test years 2100 and 2400 were added, plus a `throw` so a failing test stops the script.
- **Lesson Learned**: Logic bugs don't crash, so they need test cases that cover every branch of a rule, including the rare exception (century years).

**Before → After**
```javascript
return year % 4 === 0 && (year % 100 !== 0 || year % 400 !== 0); // before
return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0); // after
```

## Bug Report – bug3.py
- **File**: `bug_snippets/bug3.py` → fixed in `bug_fixes/bug3_fixed.py`  
- **Summary**: Runtime exception. The report crashed with `ZeroDivisionError` at the customer with no orders, so later customers were never printed.  
- **Root Cause**: `average()` divided by `len(values)` without handling an empty list, so `average([])` computed `0 / 0`.  
- **Resolution**:
  - 🤖 AI suggested a guard in `average()`: return `0.0` when the list is empty. It also suggested handling the case in `report()` and using `statistics.mean()`.
  - ✋ Testing showed `statistics.mean()` still raises `StatisticsError` on an empty list, so it was rejected. The guard in `average()` was kept, the docstring was updated, and `assert` checks were added.
- **Lesson Learned**: Read the stack trace from the bottom up to find the exact failing line. Validate inputs at the function that can fail, not only where it is called.

**Before → After**
```python
return sum(values) / len(values)                        # before
return sum(values) / len(values) if values else 0.0     # after
```

## Bug Report – bug4.js
- **File**: `bug_snippets/bug4.js` → fixed in `bug_fixes/bug4_fixed.js`  
- **Summary**: Syntax error. The script didn't run at all (`SyntaxError: missing ) after for-loop control` at line 12).  
- **Root Cause**: The `for...of` loop header was missing its closing parenthesis. JavaScript parses the whole file before running it, so nothing executed.  
- **Resolution**:
  - 🤖 AI pointed to line 12 and suggested adding `)`. It also offered a `forEach` rewrite, which worked but changed more code.
  - ✋ The one-character fix was kept. `printReceipt()` was changed to also return the total, so the result (`51.00`) could be checked automatically.
- **Lesson Learned**: The line and column in a syntax error point straight to the problem. A linter or editor bracket highlighting catches these before running the code.

**Before → After**
```javascript
for (const item of items {    // before
for (const item of items) {   // after
```

## Bug Report – bug5.c
- **File**: `bug_snippets/bug5.c` → fixed in `bug_fixes/bug5_fixed.c`  
- **Summary**: Misuse of data types. The pass rate printed `0.0%` instead of `72.5%` and `75.0%`, with no compiler warnings.  
- **Root Cause**: `passed / total` used integer division because both operands are `int`, so the fraction was truncated to `0` before the multiplication by 100 and the conversion to `double`.  
- **Resolution**:
  - 🤖 AI suggested casting before the division: `(double)passed / total * 100`. It also offered `passed * 100.0 / total` as an alternative.
  - ✋ Both worked. A third variant, `(double)(passed / total) * 100`, was tested and confirmed to still fail because the cast comes too late. The AI's main fix was kept, and `main()` was rewritten as a 5-case test loop that stays within 40 lines and returns `1` on failure.
- **Lesson Learned**: In C, the type of a result is decided by its operands, not by the variable it is stored in. Convert to floating point *before* dividing. Code that compiles without warnings can still give wrong numbers.

**Before → After**
```c
return (passed / total * 100);            /* before */
return ((double)passed / total * 100);    /* after */
```

## Bug Report – bug6.py
- **File**: `bug_snippets/bug6.py` → fixed in `bug_fixes/bug6_fixed.py`  
- **Summary**: Misuse of a built-in. `top_three()` crashed with `TypeError: 'NoneType' object is not subscriptable`.  
- **Root Cause**: `list.sort()` sorts in place and returns `None`, so `ranked` was `None`. It would also have modified the caller's list, which the docstring forbids.  
- **Resolution**:
  - 🤖 AI suggested `sorted(scores, reverse=True)[:3]`, which returns a new list, and offered `heapq.nlargest(3, scores)` as an alternative.
  - ✋ Both worked. The variant "call `sort()`, then slice" was tested and rejected: it removes the crash but changes the original list. `sorted()` was kept, and asserts were added to check that the original list is unchanged and to cover lists with fewer than 3 items.
- **Lesson Learned**: Know whether a function modifies its input in place or returns a new value (`list.sort()` vs `sorted()`). Test the stated requirements, not just "no crash".

**Before → After**
```python
ranked = scores.sort(reverse=True)          # before
return ranked[:3]

return sorted(scores, reverse=True)[:3]     # after
```

## Overall Lessons
- The AI quickly found the root cause of all 6 bugs, but **its first suggestion was not always the best one** (Bug 1). Every fix had to be run against edge cases before it was accepted.
- Giving the AI the **real error output or stack trace** made its diagnoses precise (Bugs 3, 4, 6).
- Bugs that don't crash (Bugs 2 and 5) are the most dangerous; only **tests with known expected values** reveal them.
