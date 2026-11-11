# Bug Descriptions

## Bug 1 – bug1.py
**Intended Behavior**: Return a new list containing the last `n` items of a list, in their original order. For `[10, 20, 30, 40, 50]` and `n = 2`, it should return `[40, 50]`; for `n = 5`, it should return the whole list.  
**Issue Type**: Off-by-one error.  
**Notes**: The returned list is always one item shorter than requested.

## Bug 2 – bug2.js
**Intended Behavior**: Return `true` if a year is a leap year and `false` otherwise. A leap year is divisible by 4, except years divisible by 100, unless they are also divisible by 400. For example, 2024 and 2000 are leap years; 2023 and 1900 are not.  
**Issue Type**: Logical error.  
**Notes**: Century years (1900, 2000) give the wrong result.

## Bug 3 – bug3.py
**Intended Behavior**: Print one line per customer showing their number of orders and their average order value, for every customer in the dictionary, including customers with no orders.  
**Issue Type**: Runtime exception.  
**Notes**: The program crashes partway through the report.

## Bug 4 – bug4.js
**Intended Behavior**: Print an itemized receipt for a shopping cart, with one line per item (name, quantity, line total), then a separator line and the total price of the cart.  
**Issue Type**: Syntax error.  
**Notes**: The file does not run at all.

## Bug 5 – bug5.c
**Intended Behavior**: Return the percentage of students who passed as a decimal number. For example, 29 passed out of 40 should return `72.5`, and 18 out of 24 should return `75.0`.  
**Issue Type**: Misuse of data types.  
**Notes**: Most classes are reported as `0.0%`.

## Bug 6 – bug6.py
**Intended Behavior**: Return the 3 highest scores in descending order, without modifying the original leaderboard list. For `[420, 1337, 88, 999, 512, 64]`, it should return `[1337, 999, 512]`.  
**Issue Type**: Misuse of a library/built-in function.  
**Notes**: The function raises an error instead of returning the scores.
