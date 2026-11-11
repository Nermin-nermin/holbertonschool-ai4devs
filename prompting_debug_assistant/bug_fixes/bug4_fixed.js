// Print an itemized shopping cart receipt and the total price.

const cart = [
  { name: 'Notebook', price: 3.5, qty: 4 },
  { name: 'Pen', price: 1.2, qty: 10 },
  { name: 'Backpack', price: 25.0, qty: 1 },
];

function printReceipt(items) {
  let total = 0;

  for (const item of items) {
    const lineTotal = item.price * item.qty;
    total += lineTotal;
    console.log(`${item.name.padEnd(10)} x${item.qty}  ${lineTotal.toFixed(2)}`);
  }

  console.log('-'.repeat(24));
  console.log(`TOTAL${total.toFixed(2).padStart(19)}`);
  return total;
}

const total = printReceipt(cart);
if (total.toFixed(2) !== '51.00') throw new Error(`expected 51.00, got ${total}`);
console.log('All tests passed');
