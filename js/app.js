if ('serviceWorker' in navigator) {
    // Register the service worker
    navigator.serviceWorker.register('/serviceworker.js')
      .then((registration) => {
        console.log('Service Worker registered');
      })
      .catch((error) => {
        console.error('Service Worker registration failed: ', error);
      });
  } else {
    console.log('Service Worker is not supported in this browser.');
  }  

// Request Notification Permission
if ('Notification' in window) {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      new Notification("Notification permission granted.");
    } else {
      console.error('Notification permission denied.');
    }
  });
}

// const pushNotification = async () => {
//   if ('Notification' in window) {
//     await Notification.requestPermission().then(permission => {
//       if (permission === 'granted') {
//         console.log('Notification permission granted.');
//       } else {
//         console.error('Notification permission denied.');
//       }
//     });
//   }
// }

// pushNotification()

// // Fetch Pending Tasks from Firebase
// function fetchPendingTasks() {
//   const tasksRef = db.ref('tasks');  // Assuming 'tasks' is the node in Firebase DB
//   tasksRef.orderByChild('completed').equalTo(false).on('value', snapshot => {
//     const tasks = snapshot.val();
//     if (tasks) {
//       // Convert Firebase data to an array of tasks
//       const taskList = Object.values(tasks);
//       console.log('Pending Tasks:', taskList);
//       notifyPendingTasks(taskList);
//     } else {
//       console.log('No pending tasks found');
//     }
//   });
// }

// // Trigger Notifications for Pending Tasks
// function notifyPendingTasks(tasks) {
//   tasks.forEach(task => {
//     if (!task.completed) {  // Only notify for pending tasks
//       sendTaskNotification(task);
//     }
//   });
// }

// // Function to Send Notifications
// function sendTaskNotification(task) {
//   if (Notification.permission === 'granted') {
//     navigator.serviceWorker.ready.then(registration => {
//       registration.showNotification('Pending Task Reminder', {
//         body: `Task: ${task.task}\nStatus: Pending`,
//         icon: '/icons/task-manager-icon.png',
//         badge: '/icons/badge.png',
//         actions: [
//           { action: 'view', title: 'View Task' },
//           { action: 'markComplete', title: 'Mark as Completed' }
//         ],
//         data: { taskId: task.taskid }
//       });
//     });
//   }
// }

// // Initialize the app by fetching tasks from Firebase
// fetchPendingTasks();


// if ('serviceWorker' in navigator && 'PushManager' in window) {
//   navigator.serviceWorker
//     .register('/serviceworker.js')
//     .then(async (registration) => {
//       console.log('Service Worker registered:', registration);

//       try {
//         // Automatically subscribe the user to push notifications
//         const subscription = await registration.pushManager.subscribe({
//           userVisibleOnly: true,
//           applicationServerKey: 'BClXbFKfmketTLjpgS8bBMGAHMtCfiwbbaPLdTgPgedm8DAESWldji8laLErBS-XzMxiMW6qiXNPgNGELYTzv78', // Replace with your VAPID public key
//         });

//         console.log('Push subscription:', subscription);

//         // Send the subscription details to the server
//         await fetch('/subscribe', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(subscription),
//         });

//         console.log('User subscribed to notifications!');
//       } catch (err) {
//         console.error('Failed to subscribe:', err);
//       }
//     })
//     .catch((error) => {
//       console.error('Service Worker registration failed:', error);
//     });
// }
