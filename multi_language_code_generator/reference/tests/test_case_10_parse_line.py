import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from log_analyzer import analyze, parse_line  # noqa: E402,F401

OK = '192.168.1.10 - - [15/Nov/2026:10:00:00 +0400] "GET /index.html HTTP/1.1" 200 1024'
NOT_FOUND = '192.168.1.11 - - [15/Nov/2026:10:00:05 +0400] "GET /missing HTTP/1.1" 404 512'
SERVER_ERR = '10.0.0.5 - - [15/Nov/2026:10:01:00 +0400] "POST /api/login HTTP/1.1" 500 -'
SAME_IP = '192.168.1.10 - - [15/Nov/2026:10:02:00 +0400] "GET /about HTTP/1.1" 200 2048'


class TestCase10(unittest.TestCase):
    """Spec test case 10: a single valid line is parsed into its fields."""

    def test_case(self):
        self.assertEqual(
            parse_line(OK),
            {"ip": "192.168.1.10", "method": "GET", "path": "/index.html", "status": 200, "bytes": 1024},
        )
        self.assertIsNone(parse_line("not a log line"))


if __name__ == "__main__":
    unittest.main()
