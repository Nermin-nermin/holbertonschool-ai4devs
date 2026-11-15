# Fix Validation

Fixed files are in this folder (`bug1_fixed.py`, `bug2_fixed.js`, `Bug3Fixed.java`, `bug4_fixed.py`, `bug5_fixed.js`). Tests are in `tests/`. Every test below was run on Node 22, Python 3 and OpenJDK, and the outputs were copied from the real runs.

**How to run**
```bash
python3 tests/test_python_fixes.py                 # bug1, bug4
node --test tests/test_js_fixes.js                 # bug2, bug5
javac -d out Bug3Fixed.java tests/Bug3FixedTest.java && java -cp out Bug3FixedTest   # Bug3
```

**Overall: 18 / 18 tests passed** (Python 7, JavaScript 5, Java 6).

---

## bug1.py
- **Original Issue**: Mutable default argument `cart=[]` shared one cart between all customers (Bob's cart contained Alice's apple; total 3.5 instead of 2.5).
- **Fix Applied**: `cart=None` sentinel + new list inside the function; `cart_total` simplified with `sum()`. AI fix applied as suggested.
- **Test Results**: **3/3 passed**
  - New customers get separate carts (`['apple']`, `['bread']`) ✅
  - Passing an existing cart extends it (`['apple', 'milk']`) ✅
  - Total of `['bread']` = 2.5 ✅
- **Before → After**: `Bob: ['apple', 'bread']` → `Bob: ['bread']`

## bug2.js
- **Original Issue**: `forEach(async ...)` didn't await the sends, so the function returned `"Sent 0 emails"`.
- **Fix Applied**: `await Promise.allSettled(users.map(sendEmail))` and count fulfilled results. **Manual adjustment:** wrapped the demo call in `if (require.main === module)` so importing the module in tests doesn't send emails.
- **Test Results**: **2/2 passed**
  - 3 users → `"Sent 3 emails"` ✅
  - Empty list → `"Sent 0 emails"` ✅
- **Before → After**: `Sent 0 emails` → `Sent 3 emails`

## Bug3.java
- **Original Issue**: `role == "admin"` compared references (typed "admin" was denied); `i <= roles.length` threw `ArrayIndexOutOfBoundsException`.
- **Fix Applied**: `"admin".equals(role)` and `i < roles.length`. AI fix applied as suggested.
- **Test Results**: **6/6 passed** (plain-Java test runner, no JUnit needed)
  - Input read by `Scanner` is recognised as admin ✅
  - `new String("admin")` is recognised as admin ✅
  - `"dev"` is not admin ✅
  - `null` is not admin and throws no `NullPointerException` ✅
  - `{"admin","dev",new String("admin")}` → 2, no exception ✅
  - Empty array → 0 ✅
- **Before → After**: `Access denied` + crash → `Access granted`, `Admins: 2`

## bug4.py
- **Original Issue**: Float rounding lost a cent (3 × 33.33 = 99.99); float equality was unreliable; `average_rating([])` raised `ZeroDivisionError`.
- **Fix Applied**: `Decimal` arithmetic, shares rounded down, leftover cents distributed one by one; `ValueError` for `people <= 0`; `average_rating([])` returns `None`. **Manual adjustment:** `split_bill` now returns a list of shares (one per person) instead of a single number, because a single rounded share can't represent an uneven split. This changes the function's return type, so callers must be updated.
- **Test Results**: **4/4 passed**
  - `split_bill(100, 3)` → `[33.34, 33.33, 33.33]` and the shares sum to 100 ✅
  - `shares_add_up(0.3, 3)` → `True` ✅
  - `split_bill(10, 0)` raises `ValueError` ✅
  - `average_rating([])` → `None`; `average_rating([4, 5])` → `4.5` ✅
- **Before → After**: `False, False, ZeroDivisionError` → `True, True, None`

## bug5.js
- **Original Issue**: Unescaped titles allowed stored XSS; string id `"2"` never matched numeric id `2`.
- **Fix Applied**: `escapeHtml()` for `& < > " '` and template rendering via `map`; `Number.parseInt(id, 10)` with an integer check before comparing. **Manual adjustment:** invalid ids (`"abc"`) return `undefined` explicitly instead of relying on `NaN` comparisons.
- **Test Results**: **3/3 passed** (5 assertions)
  - Malicious title is rendered as `&lt;img ... &gt;` and the output contains no `<img` tag ✅
  - `findJob(jobs, "2")` returns the job with id 2 ✅
  - `"abc"` and `"99"` return `undefined` ✅
- **Before → After**: live `<img onerror=...>` + `undefined` → escaped text + `{ id: 2, ... }`

---

## Summary

| Bug | Fix source | Manual changes | Tests | Result |
|---|---|---|---|---|
| bug1.py | AI suggestion | None | 3 | ✅ Pass |
| bug2.js | AI suggestion | Guarded demo code | 2 | ✅ Pass |
| Bug3.java | AI suggestion | None | 6 | ✅ Pass |
| bug4.py | AI suggestion + design choice | Return list of shares | 4 | ✅ Pass |
| bug5.js | AI suggestion | Explicit invalid-id handling | 3 | ✅ Pass |

**Lesson learned:** the AI found every root cause, but two fixes (bug4, bug5) needed a human decision about behaviour, such as who pays the extra cent or what an invalid id should return. Running real tests, not just reading the explanation, is what proved the fixes correct.
