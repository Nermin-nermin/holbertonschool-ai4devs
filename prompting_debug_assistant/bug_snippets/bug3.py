#!/usr/bin/env python3
"""Print the average order value for each customer."""

orders = {
    "alice": [120.0, 80.5, 42.0],
    "bob": [15.0],
    "carol": [],
    "dave": [60.0, 40.0],
}


def average(values):
    """Return the arithmetic mean of a list of numbers."""
    return sum(values) / len(values)


def report(orders_by_customer):
    """Print one line per customer with their average order value."""
    for customer, amounts in orders_by_customer.items():
        avg = average(amounts)
        print(f"{customer:<6} {len(amounts)} orders, average {avg:.2f}")


if __name__ == "__main__":
    report(orders)
