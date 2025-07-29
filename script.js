const taskInput = document.getElementById("taskInput");
const categorySelect = document.getElementById("category");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("search");
const filterCategory = document.getElementById("filterCategory");
const themeToggle = document.getElementById("themeToggle");
const emptyMessage = document.getElementById("emptyMessage");

// Load theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
}

// Theme toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Load tasks
window.onload = () => reloadTasks();

// Add Task
function addTask() {
    const text = taskInput.value.trim();
    const category = categorySelect.value;
    if (text.length < 3) return alert("Task must be at least 3 characters!");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    if (tasks.some(task => task.text.toLowerCase() === text.toLowerCase() && task.category === category))
        return alert("Task already exists!");

    tasks.push({ id: Date.now(), text, category, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskInput.value = "";
    reloadTasks();
}

// Toggle Completion
function toggleComplete(id) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    reloadTasks();
}

// Delete Task
function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    reloadTasks();
}

// Edit Task Inline
function editTask(id) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let task = tasks.find(t => t.id === id);

    const li = [...taskList.children].find(li =>
        li.querySelector(`.edit[onclick="editTask(${id})"]`)
    );

    li.innerHTML = `
        <div class="task-info">
            <input type="text" id="editInput${id}" value="${task.text}">
            <select id="editCategory${id}">
                <option value="Work" ${task.category === "Work" ? "selected" : ""}>Work</option>
                <option value="Personal" ${task.category === "Personal" ? "selected" : ""}>Personal</option>
                <option value="Shopping" ${task.category === "Shopping" ? "selected" : ""}>Shopping</option>
            </select>
        </div>
        <div class="actions">
            <button class="save" onclick="saveEdit(${id})">💾</button>
            <button class="cancel" onclick="reloadTasks()">❌</button>
        </div>
    `;
}

// Save Edit
function saveEdit(id) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const newText = document.getElementById(`editInput${id}`).value.trim();
    const newCategory = document.getElementById(`editCategory${id}`).value;

    if (newText.length < 3) return alert("Task must be at least 3 characters!");

    tasks = tasks.map(t => t.id === id ? { ...t, text: newText, category: newCategory } : t);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    reloadTasks();
}

// Filter Tasks
function filterTasks() {
    reloadTasks(searchInput.value.toLowerCase(), filterCategory.value);
}

// Reload Tasks
function reloadTasks(search = "", category = "All") {
    taskList.innerHTML = "";
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let filtered = tasks.filter(t =>
        (category === "All" || t.category === category) &&
        t.text.toLowerCase().includes(search)
    );

    emptyMessage.style.display = filtered.length ? "none" : "block";
    filtered.forEach(t => addTaskToDOM(t));
}

// Render Task
function addTaskToDOM(task) {
    const li = document.createElement("li");
    li.innerHTML = `
        <div class="task-info">
            <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleComplete(${task.id})">
            <span class="${task.completed ? "completed" : ""}"><strong>${task.text}</strong> <small>(${task.category})</small></span>
        </div>
        <div class="actions">
            <button class="edit" onclick="editTask(${task.id})">✏️</button>
            <button class="delete" onclick="deleteTask(${task.id})">X</button>
        </div>
    `;
    taskList.appendChild(li);
}
