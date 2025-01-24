import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBL0SSNVzfgEaNB8O3x_fbosA_ErhQaZjw",
  authDomain: "task-manager-app-c677e.firebaseapp.com",
  projectId: "task-manager-app-c677e",
  storageBucket: "task-manager-app-c677e.firebasestorage.app",
  messagingSenderId: "211935841951",
  appId: "1:211935841951:web:eaf8f6b4b4b2dca2cd5caa",
  measurementId: "G-YGJ0WK34K0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const showAll = document.getElementById("showAll");
const showCompleted = document.getElementById("showCompleted");
const showPending = document.getElementById("showPending");

// Add Task to Firestore
taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const taskText = taskInput.value.trim();

  if (taskText) {
    await addDoc(collection(db, "tasks"), { text: taskText, completed: false });
    taskInput.value = "";
    renderTasks();
  }
});

// Render Tasks
const renderTasks = async (filter = "all") => {
  taskList.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "tasks"));

  querySnapshot.forEach((taskDoc) => {
    const task = taskDoc.data();
    const taskId = taskDoc.id; // Get the Firestore document ID

    // Filter tasks based on the selected filter
    if (
      (filter === "completed" && !task.completed) ||
      (filter === "pending" && task.completed)
    ) return;

    const taskItem = document.createElement("li");
    taskItem.className = "list-group-item";

    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    if (task.completed) taskText.classList.add("completed");
    taskItem.appendChild(taskText);

    const buttons = document.createElement("div");

    // Complete Button
    const completeBtn = document.createElement("button");
    completeBtn.className = "btn btn-success btn-sm me-2";
    completeBtn.innerHTML = '<i class="fas fa-check"></i>';
    completeBtn.addEventListener("click", async () => {
      const taskRef = doc(db, "tasks", taskId); // Use taskId
      await updateDoc(taskRef, { completed: !task.completed });
      renderTasks(filter);
    });
    buttons.appendChild(completeBtn);

    // Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger btn-sm";
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener("click", async () => {
      const taskRef = doc(db, "tasks", taskId); // Use taskId
      await deleteDoc(taskRef);
      renderTasks(filter);
    });
    buttons.appendChild(deleteBtn);

    taskItem.appendChild(buttons);
    taskList.appendChild(taskItem);
  });
};

// Filter Buttons
showAll.addEventListener("click", () => renderTasks("all"));
showCompleted.addEventListener("click", () => renderTasks("completed"));
showPending.addEventListener("click", () => renderTasks("pending"));

// Initial Task Rendering
renderTasks();


