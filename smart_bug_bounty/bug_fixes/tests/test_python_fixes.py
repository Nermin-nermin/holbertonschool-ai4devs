import sys, pathlib, unittest
from decimal import Decimal
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent))
import bug1_fixed as b1
import bug4_fixed as b4


class TestBug1(unittest.TestCase):
    def test_new_customers_get_separate_carts(self):
        self.assertEqual(b1.add_to_cart("apple"), ["apple"])
        self.assertEqual(b1.add_to_cart("bread"), ["bread"])

    def test_existing_cart_is_extended(self):
        cart = b1.add_to_cart("apple")
        self.assertEqual(b1.add_to_cart("milk", cart), ["apple", "milk"])

    def test_total(self):
        self.assertEqual(b1.cart_total(["bread"], {"bread": 2.5}), 2.5)


class TestBug4(unittest.TestCase):
    def test_100_split_3_adds_up(self):
        shares = b4.split_bill(100, 3)
        self.assertEqual(shares, [Decimal("33.34"), Decimal("33.33"), Decimal("33.33")])
        self.assertTrue(b4.shares_add_up(100, 3))

    def test_float_total_adds_up(self):
        self.assertTrue(b4.shares_add_up(0.3, 3))

    def test_invalid_people(self):
        with self.assertRaises(ValueError):
            b4.split_bill(10, 0)

    def test_average_empty_and_normal(self):
        self.assertIsNone(b4.average_rating([]))
        self.assertEqual(b4.average_rating([4, 5]), 4.5)


if __name__ == "__main__":
    unittest.main(verbosity=2)
