# Bug Descriptions

Five buggy snippets in 3 languages (Python, JavaScript, Java), 10–40 lines each. Every bug was reproduced by running the file; "Observed" shows real output.

## bug1.py
- **Intended Behavior**: `add_to_cart(item)` starts a new empty cart for each new customer; `cart_total` sums item prices.
- **Current Issue**: the mutable default argument `cart=[]` is created once, so all customers share one cart and totals are wrong.
- **Observed**: `Bob: ['apple', 'bread']`, total `3.5` (expected `['bread']`, `2.5`).
- **Category / Severity**: shared state - High

## bug2.js
- **Intended Behavior**: send a welcome email to every user, wait for all, then return `"Sent 3 emails"`.
- **Current Issue**: `users.forEach(async ...)` ignores the returned promises, so the function returns before any email is sent.
- **Observed**: `Sent 0 emails`.
- **Category / Severity**: async control flow - High

## bug3.java
- **Intended Behavior**: `isAdmin("admin")` is true for a role typed by the user; `countAdmins` returns 2 for `{"admin","dev",new String("admin")}`.
- **Current Issue**: (1) `role == "admin"` compares references, not text, so typed input is never equal; (2) loop condition `i <= roles.length` reads past the end of the array.
- **Observed**: `Access denied`, then `ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3`.
- **Category / Severity**: equality + off-by-one - High

## bug4.py
- **Intended Behavior**: split a bill so the shares add up exactly to the total; `average_rating([])` handles a restaurant with no ratings.
- **Current Issue**: (1) float rounding per share loses a cent (3 × 33.33 = 99.99) and float `==` is unreliable; (2) dividing by `len([]) == 0`.
- **Observed**: `33.33`, `False`, `False`, then `ZeroDivisionError: division by zero`.
- **Category / Severity**: numeric precision + edge case - Medium

## bug5.js
- **Intended Behavior**: render job titles as plain text in `<li>` items, and `?id=2` finds the job with id 2.
- **Current Issue**: (1) titles are concatenated into HTML without escaping, so a title containing HTML is rendered as live markup; an attacker could use an image tag with an onerror handler to run JavaScript (stored XSS). The demo uses a harmless bold tag instead of a script; (2) `URLSearchParams.get()` returns the string `"2"`, which never `===` the number `2`.
- **Observed**: the title's bold tag appears unescaped in the HTML output, and `undefined` for the lookup.
- **Category / Severity**: security (XSS) + type mismatch - Critical
