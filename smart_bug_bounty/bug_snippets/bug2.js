// Send a welcome email to each new user, then report how many were sent.
// Expected output: "Sent 3 emails"

function sendEmail(user) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`sent to ${user.email}`), 50);
  });
}

async function notifyAll(users) {
  let sent = 0;
  users.forEach(async (user) => {
    await sendEmail(user);
    sent++;
  });
  return `Sent ${sent} emails`;
}

const users = [
  { email: 'aysel@example.com' },
  { email: 'murad@example.com' },
  { email: 'leyla@example.com' },
];

notifyAll(users).then(console.log);

module.exports = { notifyAll };
