class TodoApp {
	constructor() {
		// DOM Elements
		this.taskTextInput = document.getElementById("task-input");
		this.taskDateInput = document.getElementById("date-input");
		this.taskTimeInput = document.getElementById("time-input");
		this.addTaskBtn = document.getElementById("add-task-btn");
		this.taskList = document.getElementById("task-list");

		// Filter Buttons
		this.filterAllBtn = document.getElementById("filter-all");
		this.filterActiveBtn = document.getElementById("filter-active");
		this.filterCompletedBtn = document.getElementById("filter-completed");

		// Tasks and Event Listeners
		this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
		this.currentFilter = "all";

		this.addEventListeners();
		this.renderTasks();
	}

	addEventListeners() {
		this.addTaskBtn.addEventListener("click", () => this.addTask());
		this.filterAllBtn.addEventListener("click", () =>
			this.setFilter("all")
		);
		this.filterActiveBtn.addEventListener("click", () =>
			this.setFilter("active")
		);
		this.filterCompletedBtn.addEventListener("click", () =>
			this.setFilter("completed")
		);

		// Allow adding task with Enter key
		this.taskTextInput.addEventListener("keypress", (e) => {
			if (e.key === "Enter") this.addTask();
		});
	}

	addTask() {
		const taskText = this.taskTextInput.value.trim();
		const taskDate = this.taskDateInput.value;
		const taskTime = this.taskTimeInput.value;

		// Check if both task text and date are present
		if (!taskText || !taskDate) {
			// Show popup message
			alert("Please enter both task title and date/time.");
			return;
		}

		// Create a new task object
		const newTask = {
			id: Date.now(), // Unique identifier
			text: taskText,
			date: taskDate,
			time: taskTime,
			completed: false,
		};

		// Add the task to tasks array
		this.tasks.push(newTask);

		// Save tasks to local storage
		this.saveTasks();

		// Clear input fields
		this.taskTextInput.value = "";
		this.taskDateInput.value = "";
		this.taskTimeInput.value = "";

		// Render tasks
		this.renderTasks();
	}

	setFilter(filter) {
		this.currentFilter = filter;

		// Update active filter button
		[
			this.filterAllBtn,
			this.filterActiveBtn,
			this.filterCompletedBtn,
		].forEach((btn) => btn.classList.remove("active"));

		document.getElementById(`filter-${filter}`).classList.add("active");
		this.renderTasks();
	}

	// Helper method to convert 24-hour time to 12-hour format
	convertTo12HourFormat(time) {
		if (!time) return '';
		
		const [hours, minutes] = time.split(':');
		const hourNum = parseInt(hours, 10);
		const period = hourNum >= 12 ? 'PM' : 'AM';
		const convertedHours = hourNum % 12 || 12;
		
		return `${convertedHours}:${minutes} ${period}`;
	}

	renderTasks() {
		this.taskList.innerHTML = "";

		const filteredTasks = this.tasks.filter((task) => {
			if (this.currentFilter === "active") return !task.completed;
			if (this.currentFilter === "completed") return task.completed;
			return true;
		});

		filteredTasks.forEach((task) => {
			const li = document.createElement("li");
			li.classList.add("task-item");
			if (task.completed) li.classList.add("completed");

			// Convert time to 12-hour format
			const formattedTime = this.convertTo12HourFormat(task.time);

			li.innerHTML = `
                <div class="task-content">
                    ${
						task.completed
							? '<span class="tick-mark">&#10004;</span>'
							: ""
					}
                    <span class="task-text">
                        ${task.text} 
                        ${task.date ? `(${task.date})` : ""}
                        ${formattedTime ? `at ${formattedTime}` : ""}
                    </span>
                </div>
                <div class="task-actions">
                    <button onclick="todoApp.toggleComplete(${task.id})">
                        ${task.completed ? "Undo" : "Complete"}
                    </button>
                    <button onclick="todoApp.editTask(${task.id})">Edit</button>
                    <button onclick="todoApp.deleteTask(${
						task.id
					})">Delete</button>
                </div>
            `;

			this.taskList.appendChild(li);
		});
	}

	toggleComplete(id) {
		const task = this.tasks.find((t) => t.id === id);
		task.completed = !task.completed;
		this.saveTasks();
		this.renderTasks();
	}

	editTask(id) {
		const task = this.tasks.find((t) => t.id === id);
		const li = this.taskList.querySelector(
			`li:has(button[onclick="todoApp.editTask(${id})"])`
		);

		li.innerHTML = `
            <input type="text" class="edit-input" value="${task.text}">
            <div class="task-actions">
                <input type="date" value="${task.date || ""}">
                <input type="time" value="${task.time || ""}">
                <button onclick="todoApp.saveEdit(${id})">Save</button>
                <button onclick="todoApp.renderTasks()">Cancel</button>
            </div>
        `;
	}

	saveEdit(id) {
		const task = this.tasks.find((t) => t.id === id);
		const li = this.taskList.querySelector(
			`li:has(button[onclick="todoApp.saveEdit(${id})"])`
		);

		task.text = li.querySelector(".edit-input").value;
		task.date = li.querySelector('input[type="date"]').value;
		task.time = li.querySelector('input[type="time"]').value;

		this.saveTasks();
		this.renderTasks();
	}

	deleteTask(id) {
		this.tasks = this.tasks.filter((t) => t.id !== id);
		this.saveTasks();
		this.renderTasks();
	}

	saveTasks() {
		localStorage.setItem("tasks", JSON.stringify(this.tasks));
	}
}

// Initialize the app
const todoApp = new TodoApp();