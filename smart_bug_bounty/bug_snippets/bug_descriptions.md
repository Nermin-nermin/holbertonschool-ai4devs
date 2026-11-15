# Bug Descriptions

Five buggy snippets in **3 languages** (Python, JavaScript, Java), each 10–40 lines. Every bug below was reproduced by running the file; the "Observed output" lines are real output, not predictions.

| File | Language | Bug category | Severity |
|---|---|---|---|
| `bug1.py` | Python | Shared state (mutable default argument) | High |
| `bug2.js` | JavaScript | Async / concurrency (`forEach` with `async`) | High |
| `Bug3.java` | Java | String identity comparison + off-by-one loop | High |
| `bug4.py` | Python | Floating-point money rounding + division by zero | Medium |
| `bug5.js` | JavaScript | Security (XSS) + type mismatch | Critical |

## bug1.py
- **Intended Behavior**: `add_to_cart(item)` starts a *new, empty* cart for each new customer and adds the item; passing an existing cart adds to that cart. `cart_total` sums the prices of the items.
- **Current Issue**: the default argument `cart=[]` is created once when the function is defined, so every customer shares the same list. Items leak between customers and totals are wrong.
- **Observed output**: `Alice: ['apple', 'bread']`, `Bob: ['apple', 'bread']`, `Bob total: 3.5` (expected `['apple']`, `['bread']`, `2.5`).

## bug2.js
- **Intended Behavior**: send a welcome email to every user, wait until all are sent, then return `"Sent 3 emails"`.
- **Current Issue**: `users.forEach(async ...)` does not wait for the async callbacks; `notifyAll` returns before any email resolves, so the counter is still 0. Errors inside the callbacks would also be unhandled.
- **Observed output**: `Sent 0 emails` (expected `Sent 3 emails`).

## Bug3.java
*(File name is `Bug3.java` because Java requires the file name to match the public class `Bug3`.)*
- **Intended Behavior**: `isAdmin("admin")` returns true for a role typed by the user; `countAdmins` returns how many roles in an array are `"admin"` (2 for `{"admin","dev",new String("admin")}`).
- **Current Issue**:
  1. `role == "admin"` compares object references, not text, so a string read from input (or created with `new String`) is never equal → admins are denied access.
  2. The loop uses `i <= roles.length`, which reads one element past the end → `ArrayIndexOutOfBoundsException`.
- **Observed output**: `Access denied`, then `ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3`.

## bug4.py
- **Intended Behavior**: split a bill so that the individual shares (in cents) **add back up exactly** to the total; `shares_add_up(100, 3)` and `shares_add_up(0.3, 3)` should be `True`. `average_rating([])` should handle a restaurant with no ratings yet.
- **Current Issue**:
  1. Each share is rounded with binary floats (`round(100/3, 2)` = 33.33), so 3 × 33.33 = 99.99 and one cent disappears; float equality (`0.1*3 == 0.3`) is also unreliable.
  2. `average_rating([])` divides by `len([]) == 0`.
- **Observed output**: `33.33`, `False`, `False`, then `ZeroDivisionError: division by zero`.

## bug5.js
- **Intended Behavior**: render job titles as **plain text** inside `<li>` elements, and `findJob(jobs, params.get('id'))` with `?id=2` returns the job whose id is 2.
- **Current Issue**:
  1. Titles are concatenated into HTML without escaping, so a malicious title such as `<img src=x onerror="alert(document.cookie)">` becomes live markup → **stored XSS** (cookie theft).
  2. `URLSearchParams.get()` always returns a string (`"2"`), and `===` compares it with the number `2`, so no job is ever found.
  3. Minor: `var i` in the loop leaks into function scope (style issue).
- **Observed output**: raw `<img src=x onerror=...>` inside the HTML, and `undefined` for the lookup.
