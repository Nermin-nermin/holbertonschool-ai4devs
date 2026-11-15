"""Shopping cart: add items to a customer's cart and return the cart."""


def add_to_cart(item, cart=None):
    """Add an item to the cart. A new customer starts with an empty cart."""
    if cart is None:          # create a fresh list on every call
        cart = []
    cart.append(item)
    return cart


def cart_total(cart, prices):
    """Return the total price of all items in the cart."""
    return sum(prices[item] for item in cart)


if __name__ == "__main__":
    prices = {"apple": 1.0, "bread": 2.5, "milk": 1.2}
    alice = add_to_cart("apple")
    bob = add_to_cart("bread")
    print("Alice:", alice)
    print("Bob:", bob)
    print("Bob total:", cart_total(bob, prices))
