// Send a welcome email to each new user, then report how many were sent.

function sendEmail(user) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`sent to ${user.email}`), 50);
  });
}

async function notifyAll(users) {
  // Promise.all waits for every email; forEach ignores the returned promises.
  const results = await Promise.allSettled(users.map((user) => sendEmail(user)));
  const sent = results.filter((r) => r.status === 'fulfilled').length;
  return `Sent ${sent} emails`;
}

const users = [
  { email: 'aysel@example.com' },
  { email: 'murad@example.com' },
  { email: 'leyla@example.com' },
];

if (require.main === module) notifyAll(users).then(console.log);

module.exports = { notifyAll, sendEmail };
