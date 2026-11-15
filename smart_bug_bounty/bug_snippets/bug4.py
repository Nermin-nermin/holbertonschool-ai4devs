"""Split a restaurant bill evenly and report each person's share."""


def split_bill(total, people):
    """Return each person's share, rounded to 2 decimals."""
    share = round(total / people, 2)
    return share


def shares_add_up(total, people):
    """Check that the individual shares add back up to the total."""
    share = split_bill(total, people)
    return share * people == total


def average_rating(ratings):
    """Average of a list of ratings (1-5)."""
    return sum(ratings) / len(ratings)


if __name__ == "__main__":
    print(split_bill(100, 3))           # 33.33 each -> 99.99, one cent lost
    print(shares_add_up(100, 3))        # expected True
    print(shares_add_up(0.3, 3))        # expected True (0.1 each)
    print(average_rating([]))           # new restaurant with no ratings
