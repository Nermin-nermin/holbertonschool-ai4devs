# Benchmark Tasks

Four small tasks, each solvable in 15–30 minutes. Each one is done twice, once without AI help and once with an AI assistant, to compare speed and quality. Every task has fixed inputs, outputs and acceptance criteria, so both runs are judged the same way.

---

## Task 1 - CRUD Endpoint
**Time box**: 25 minutes
**Requirements**: Implement `POST /users` in Node.js (Express) that validates input and stores the user in memory.
**Inputs**: JSON body `{ "name": string, "email": string }`
**Outputs**: The stored user with a generated `id`, e.g. `{ "id": 1, "name": "Aysel", "email": "aysel@example.com" }`
**Acceptance Criteria**:
- Returns `201` and the created user on success
- Returns `400` with `{ "error": "..." }` when `name` is missing/empty or `email` is not a valid address
- Returns `409` when the email already exists
- `GET /users/:id` returns `200` with the user, or `404` if not found

---

## Task 2 - Data Transformation (CSV to JSON summary)
**Time box**: 20 minutes
**Requirements**: Write a function `summarizeSales(csvText)` that parses a CSV of sales and returns totals per product.
**Inputs**: CSV text with header `date,product,quantity,unit_price`, e.g.
```
2026-11-01,apple,3,0.50
2026-11-01,bread,1,1.20
2026-11-02,apple,2,0.50
```
**Outputs**: Array sorted by revenue (descending): `[{ "product": "apple", "quantity": 5, "revenue": 2.5 }, { "product": "bread", "quantity": 1, "revenue": 1.2 }]`
**Acceptance Criteria**:
- Revenue is rounded to 2 decimals
- Rows with a missing or non-numeric `quantity`/`unit_price` are skipped and counted in a `skipped` field
- Empty input (header only) returns `[]`
- At least 4 unit tests pass (normal case, bad row, empty input, sorting)

---

## Task 3 - Bug Fix and Refactor
**Time box**: 20 minutes
**Requirements**: Fix and refactor the given `calculateDiscount(cart)` function, which gives wrong totals and is hard to read (nested `if`s, magic numbers).
**Inputs**: Cart object `{ items: [{ price, qty }], coupon: "SAVE10" | "SAVE20" | null }`
**Outputs**: Final total (number)
**Acceptance Criteria**:
- `SAVE10` = 10% off, `SAVE20` = 20% off; unknown coupons are ignored
- The discount is applied once to the subtotal, not per item (the original bug)
- The total never goes below `0` and is rounded to 2 decimals
- Discount rates live in one constant object (no magic numbers); existing tests plus 3 new edge-case tests pass

---

## Task 4 - Frontend Component (Search Filter)
**Time box**: 30 minutes
**Requirements**: Build a plain HTML/CSS/JS page with a search box that filters a list of 20 product names as the user types.
**Inputs**: Text typed into the search box
**Outputs**: Only the products whose name contains the text (case-insensitive) are shown, plus a "N results" counter
**Acceptance Criteria**:
- Filtering updates on every keystroke without reloading the page
- Shows "No results" when nothing matches
- Clearing the box shows all 20 products again
- Works with the keyboard only and is readable on a 375 px-wide mobile screen

---

## How results are recorded
For every task and both runs (manual vs AI-assisted), log: time to first passing version, number of acceptance criteria met, number of AI suggestions accepted or rejected, and bugs found afterwards.
