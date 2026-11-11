#!/usr/bin/env python3
"""Show the top 3 scores of a game leaderboard, highest first."""


def top_three(scores):
    """Return the 3 highest scores in descending order.

    The original list must not be modified.
    """
    ranked = scores.sort(reverse=True)
    return ranked[:3]


if __name__ == "__main__":
    leaderboard = [420, 1337, 88, 999, 512, 64]
    best = top_three(leaderboard)
    print("Top 3:", best)               # expected [1337, 999, 512]
    print("Original:", leaderboard)     # expected unchanged order
