"""Split a restaurant bill evenly and report each person's share."""
from decimal import Decimal, ROUND_DOWN


def split_bill(total, people):
    """Return a list of shares (Decimal, 2 dp) that add up exactly to total.

    Remaining cents are given one by one to the first people, so nothing is lost.
    """
    if people <= 0:
        raise ValueError("people must be a positive integer")
    total = Decimal(str(total))
    base = (total / people).quantize(Decimal("0.01"), rounding=ROUND_DOWN)
    remainder_cents = int((total - base * people) * 100)
    return [base + Decimal("0.01") if i < remainder_cents else base for i in range(people)]


def shares_add_up(total, people):
    """Check that the individual shares add back up to the total."""
    return sum(split_bill(total, people)) == Decimal(str(total))


def average_rating(ratings):
    """Average of a list of ratings (1-5); None when there are no ratings yet."""
    if not ratings:
        return None
    return sum(ratings) / len(ratings)


if __name__ == "__main__":
    print(split_bill(100, 3))
    print(shares_add_up(100, 3))
    print(shares_add_up(0.3, 3))
    print(average_rating([]))
