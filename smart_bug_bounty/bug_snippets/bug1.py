"""Shopping cart: add items to a customer's cart and return the cart."""


def add_to_cart(item, cart=[]):
    """Add an item to the cart. A new customer starts with an empty cart."""
    cart.append(item)
    return cart


def cart_total(cart, prices):
    """Return the total price of all items in the cart."""
    total = 0
    for item in cart:
        total += prices[item]
    return total


if __name__ == "__main__":
    prices = {"apple": 1.0, "bread": 2.5, "milk": 1.2}
    alice = add_to_cart("apple")
    bob = add_to_cart("bread")          # Bob is a NEW customer
    print("Alice:", alice)              # expected ['apple']
    print("Bob:", bob)                  # expected ['bread']
    print("Bob total:", cart_total(bob, prices))  # expected 2.5
