#!/usr/bin/env python3
"""Show the top 3 scores of a game leaderboard, highest first."""


def top_three(scores):
    """Return the 3 highest scores in descending order.

    The original list must not be modified.
    """
    return sorted(scores, reverse=True)[:3]


if __name__ == "__main__":
    leaderboard = [420, 1337, 88, 999, 512, 64]
    snapshot = list(leaderboard)
    best = top_three(leaderboard)
    print("Top 3:", best)
    print("Original:", leaderboard)
    assert best == [1337, 999, 512]
    assert leaderboard == snapshot, "original list was modified"
    assert top_three([5, 1]) == [5, 1]
    assert top_three([]) == []
    print("top_three([5, 1]) ->", top_three([5, 1]))
    print("top_three([]) ->", top_three([]))
    print("All tests passed")
