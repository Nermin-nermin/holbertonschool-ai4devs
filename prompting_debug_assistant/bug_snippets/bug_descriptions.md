# Bug Descriptions

## Bug 1 – bug1.py
**Language**: Python  
**Intended Behavior**: Return the last `n` items of a list, in their original order.  
**Issue Type**: Off-by-one error (loop logic).  
**Notes**: The loop's start index is `len(items) - n + 1` instead of `len(items) - n`, so the function always returns one item too few. `last_n([10, 20, 30, 40, 50], 2)` returns `[50]` instead of `[40, 50]`, and it fails when `n == len(items)`.

## Bug 2 – bug2.js
**Language**: JavaScript  
**Intended Behavior**: Return `true` if a year is a leap year: divisible by 4, except years divisible by 100 unless they are also divisible by 400.  
**Issue Type**: Logical error.  
**Notes**: The 400 rule is inverted (`year % 400 !== 0` instead of `=== 0`). Ordinary years like 2024 work, but century years are wrong: 1900 returns `true` and 2000 returns `false`. No error is thrown; the built-in tests print `FAIL`.

## Bug 3 – bug3.py
**Language**: Python  
**Intended Behavior**: Print each customer's number of orders and their average order value.  
**Issue Type**: Runtime exception.  
**Notes**: `average()` divides by `len(values)` without checking for an empty list. The program prints alice and bob, then crashes with `ZeroDivisionError` on `carol`, who has no orders, so dave is never reported.

## Bug 4 – bug4.js
**Language**: JavaScript  
**Intended Behavior**: Print an itemized receipt for a shopping cart (name, quantity, line total) followed by the cart total.  
**Issue Type**: Syntax error.  
**Notes**: The `for...of` header is missing its closing parenthesis: `for (const item of items {`. Node.js refuses to run the file at all and reports `SyntaxError: missing ) after for-of iterable` (wording varies by version).

## Bug 5 – bug5.c
**Language**: C  
**Intended Behavior**: Return the percentage of students who passed as a `double` (e.g. 29 of 40 → `72.5`).  
**Issue Type**: Misuse of data types.  
**Notes**: `passed / total` is integer division, so the fraction is truncated to `0` (or `1` when everyone passed) *before* multiplying by 100 and converting to `double`. It compiles without warnings, but prints `0.0%`, `0.0%`, `100.0%` instead of `72.5%`, `75.0%`, `100.0%`.

## Bug 6 – bug6.py
**Language**: Python  
**Intended Behavior**: Return the 3 highest scores in descending order without modifying the original list.  
**Issue Type**: Misuse of a library/built-in API.  
**Notes**: `list.sort()` sorts in place and returns `None`, so `ranked[:3]` raises `TypeError: 'NoneType' object is not subscriptable`. It also violates the "do not modify the original" requirement; `sorted(scores, reverse=True)` is the intended API.
