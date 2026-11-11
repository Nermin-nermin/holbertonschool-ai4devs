#!/usr/bin/env python3
"""Return the last n items of a list."""


def last_n(items, n):
    """Return a new list with the last n items of items, in order."""
    if n <= 0:
        return []
    return items[-n:]


if __name__ == "__main__":
    tests = [
        (([10, 20, 30, 40, 50], 2), [40, 50]),
        (([10, 20, 30, 40, 50], 5), [10, 20, 30, 40, 50]),
        (([1, 2, 3, 4, 5], 3), [3, 4, 5]),
        (([10, 20, 30, 40, 50], 0), []),
        (([10, 20, 30, 40, 50], 7), [10, 20, 30, 40, 50]),
        (([], 3), []),
    ]
    for (items, n), expected in tests:
        result = last_n(items, n)
        print(f"last_n({items}, {n}) -> {result}")
        assert result == expected, f"expected {expected}"
    print("All tests passed")
