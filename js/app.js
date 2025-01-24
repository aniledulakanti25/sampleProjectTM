// Check if service workers are supported
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceworker.js')
      .then(registration => {
        console.log('Service Worker registered successfully:', registration);
  
        // Automatically subscribe the user to push notifications
        subscribeUserToPush(registration);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  } else {
    console.log('Service Worker is not supported in this browser.');
  }
  
  // Function to subscribe the user to push notifications
  function subscribeUserToPush(registration) {
    // Public VAPID Key (replace with your actual public VAPID key)
    const publicVapidKey = 'BGYPBFHzOYzJCGR5MvXP_PJBg_B7_wcdx3fAhwaVw5kPA537JL-baNcfQZSzOKVsqRm_D3AQ_JzFKe1N6vg2qts'; // Replace with your public VAPID key
  
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
  
  // Fetch pending tasks from the database (Firestore or local storage)
  function fetchPendingTasks() {
    // For now, using a dummy array of tasks
    const tasks = [
      { id: 1, text: "Complete project report", completed: false },
      { id: 2, text: "Submit assignment", completed: false },
      { id: 3, text: "Review meeting notes", completed: true },
    ];
  
    return tasks.filter(task => !task.completed);  // Return only pending tasks
  }
  
  // Send push notifications about pending tasks
  function notifyPendingTasks() {
    const pendingTasks = fetchPendingTasks();
    if (pendingTasks.length > 0) {
      pendingTasks.forEach(task => {
        sendPushNotification(task);
      });
    }
  }
  
  // Send push notification for a specific task
  function sendPushNotification(task) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const options = {
        body: `You have a pending task: ${task.text}`,
        icon: 'icons/icon-192x192.png',
        badge: 'icons/icon-48x48.png'
      };
  
      new Notification('Pending Task Reminder', options);
    }
  }
  
  // Check and notify pending tasks every 10 seconds for testing
  setInterval(notifyPendingTasks, 100000);  // This is just for testing, you can adjust or remove this
  