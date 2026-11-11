#!/usr/bin/env python3
"""Return the last n items of a list."""


def last_n(items, n):
    """Return a new list with the last n items of items, in order."""
    if n <= 0:
        return []
    result = []
    for i in range(len(items) - n + 1, len(items)):
        result.append(items[i])
    return result


if __name__ == "__main__":
    numbers = [10, 20, 30, 40, 50]
    print(last_n(numbers, 2))   # expected [40, 50]
    print(last_n(numbers, 5))   # expected [10, 20, 30, 40, 50]
