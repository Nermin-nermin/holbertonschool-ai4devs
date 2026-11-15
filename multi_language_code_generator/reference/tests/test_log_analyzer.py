"""Tests for the reference Log Analyzer. Run from reference/: python -m unittest discover tests"""
import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from log_analyzer import analyze, parse_line  # noqa: E402

OK = '192.168.1.10 - - [15/Nov/2026:10:00:00 +0400] "GET /index.html HTTP/1.1" 200 1024'
NOT_FOUND = '192.168.1.11 - - [15/Nov/2026:10:00:05 +0400] "GET /missing HTTP/1.1" 404 512'
SERVER_ERR = '10.0.0.5 - - [15/Nov/2026:10:01:00 +0400] "POST /api/login HTTP/1.1" 500 -'
SAME_IP = '192.168.1.10 - - [15/Nov/2026:10:02:00 +0400] "GET /about HTTP/1.1" 200 2048'


class TestParseLine(unittest.TestCase):
    def test_parses_valid_line(self):
        self.assertEqual(
            parse_line(OK),
            {"ip": "192.168.1.10", "method": "GET", "path": "/index.html", "status": 200, "bytes": 1024},
        )

    def test_dash_bytes_become_zero(self):
        self.assertEqual(parse_line(SERVER_ERR)["bytes"], 0)

    def test_malformed_line_returns_none(self):
        self.assertIsNone(parse_line("this is not a log line"))

    def test_missing_status_returns_none(self):
        self.assertIsNone(parse_line('1.2.3.4 - - [15/Nov/2026:10:00:00 +0400] "GET / HTTP/1.1"'))


class TestAnalyze(unittest.TestCase):
    def test_empty_input(self):
        result = analyze([])
        self.assertEqual(result["total_requests"], 0)
        self.assertEqual(result["error_rate"], 0.0)
        self.assertEqual(result["top_paths"], [])

    def test_blank_lines_are_ignored(self):
        result = analyze(["", "   ", OK])
        self.assertEqual(result["total_requests"], 1)
        self.assertEqual(result["malformed_lines"], 0)

    def test_counts_requests_and_unique_visitors(self):
        result = analyze([OK, NOT_FOUND, SERVER_ERR, SAME_IP])
        self.assertEqual(result["total_requests"], 4)
        self.assertEqual(result["unique_visitors"], 3)

    def test_error_rate_counts_4xx_and_5xx(self):
        result = analyze([OK, NOT_FOUND, SERVER_ERR, SAME_IP])
        self.assertEqual(result["error_count"], 2)
        self.assertEqual(result["error_rate"], 50.0)

    def test_error_rate_is_rounded_to_two_decimals(self):
        result = analyze([OK, OK, NOT_FOUND])
        self.assertEqual(result["error_rate"], 33.33)

    def test_malformed_lines_are_counted_not_raised(self):
        result = analyze([OK, "garbage", "another bad line"])
        self.assertEqual(result["total_requests"], 1)
        self.assertEqual(result["malformed_lines"], 2)

    def test_total_bytes(self):
        result = analyze([OK, NOT_FOUND, SERVER_ERR])
        self.assertEqual(result["total_bytes"], 1024 + 512 + 0)

    def test_status_counts_are_sorted_strings(self):
        result = analyze([OK, NOT_FOUND, SAME_IP])
        self.assertEqual(result["status_counts"], {"200": 2, "404": 1})

    def test_top_paths_order_and_tie_break(self):
        lines = [OK, OK, SAME_IP, NOT_FOUND]
        result = analyze(lines)
        self.assertEqual(
            result["top_paths"],
            [{"path": "/index.html", "count": 2}, {"path": "/about", "count": 1}, {"path": "/missing", "count": 1}],
        )

    def test_all_errors(self):
        result = analyze([NOT_FOUND, SERVER_ERR])
        self.assertEqual(result["error_rate"], 100.0)


if __name__ == "__main__":
    unittest.main()
