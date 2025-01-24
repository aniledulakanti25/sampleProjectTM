const express = require('express');
const bodyParser = require('body-parser');
const webPush = require('web-push');

const app = express();
app.use(bodyParser.json());

const vapidKeys = {
  publicKey: 'BClXbFKfmketTLjpgS8bBMGAHMtCfiwbbaPLdTgPgedm8DAESWldji8laLErBS-XzMxiMW6qiXNPgNGELYTzv78',
  privateKey: '4xAnkx9W8-NplAxgpn7iIq5VwjGHuiJxSCOWwJOfpOU',
};

webPush.setVapidDetails('anil.nrsc2025@gmail.com', vapidKeys.publicKey, vapidKeys.privateKey);

let subscriptions = [];

// Save subscription
app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: 'Subscription saved.' });
});

// Send notification
app.post('/sendNotification', (req, res) => {
  const payload = JSON.stringify({
    title: 'Task Reminder',
    body: 'You have pending tasks in Task Manager!',
  });

  const promises = subscriptions.map((sub) =>
    webPush.sendNotification(sub, payload)
  );

  Promise.all(promises)
    .then(() => res.status(200).json({ message: 'Notifications sent.' }))
    .catch((err) => {
      console.error('Error sending notifications:', err);
      res.status(500).json({ error: 'Failed to send notifications.' });
    });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:5500');
  console.log('VAPID Public Key:', vapidKeys.publicKey);
});
