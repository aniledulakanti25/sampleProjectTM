// Check if Notification and Service Worker are supported by the browser
if ('Notification' in window && 'serviceWorker' in navigator) {
  // Request permission for notifications
  Notification.requestPermission().then(permission => {
      if (permission === "granted") {
          console.log("Notification permission granted.");
      } else {
          console.log("Notification permission denied.");
      }
  });

  // Handle the click event for subscribing to push notifications
  document.getElementById('subscribeBtn').addEventListener('click', function () {
      navigator.serviceWorker.ready.then(function (registration) {
          subscribeUserToPush(registration);
      });
  });
}

// Function to subscribe the user to push notifications
function subscribeUserToPush(registration) {
  // Public VAPID Key (replace with your actual public VAPID key)
  const publicVapidKey = 'BBao7mgQbllM9BVEiEEd_whlP8VyQTE0zBldOVZhGzKq3mHFi6ElEMjl7mEdPRFfwiB71fUmMwfVTwgZNj9TFjM'; // Replace with your public VAPID key

  // Convert the VAPID public key to Uint8Array
  const convertedVapidKey = urlBase64ToUint8Array(publicVapidKey);

  // Subscribe to push notifications
  registration.pushManager.subscribe({
      userVisibleOnly: true, // Only send notifications the user can see
      applicationServerKey: convertedVapidKey
  })
      .then(subscription => {
          console.log('User subscribed:', subscription);
          // You can send the subscription object to your server to save it and use it for sending notifications
      })
      .catch(error => {
          console.error('Subscription failed:', error);
      });
}

// Helper function to convert VAPID public key to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
