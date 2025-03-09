const taskCounter = document.getElementById("taskCounter");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("add-task-btn");

let totalTasks = 0,
  completedTasks = 0;

function updateTaskCounter() {
  taskCounter.innerText = `${completedTasks}/${totalTasks} Tasks Completed`;
}

function saveTasksToLocalStorage() {
  const tasks = Array.from(taskList.children).map((taskItem) => {
    const taskCheckbox = taskItem.querySelector(".taskCheckbox");
    const taskName = taskItem.querySelector(".taskName").innerText;
    const timestamps = Array.from(
      taskItem.querySelectorAll(".taskTimestamps time")
    ).map((time) => time.innerText);
    return {
      name: taskName,
      completed: taskCheckbox.checked,
      timestamps: timestamps,
    };
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  savedTasks.forEach((task) => {
    addTask(task.name, task.completed, task.timestamps);
  });
}

function addTask(
  name = taskInput.value.trim(),
  completed = false,
  timestamps = []
) {
  if (name) {
    const taskItem = document.createElement("li");
    taskItem.innerHTML = `
      <div class="taskEntry flex-item">
        <input type="checkbox" class="taskCheckbox flex-item" ${
          completed ? "checked" : ""
        } />
        <span class="taskName">${name}</span>
        <div class="taskActions">
          <button title="Edit" class="edit-task-btn"><i class="fas fa-edit"></i></button>
          <button title="Delete" class="delete-task-btn"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>
      <div class="taskTimestamps flex-item">
        <time>${
          timestamps[0] || `Created:${new Date().toLocaleString()}`
        }</time>
        ${
          timestamps[1]
            ? `<time class="editTimestamp">${timestamps[1]}</time>`
            : ""
        }
      </div>
    `;
    taskList.appendChild(taskItem);
    taskInput.value = "";
    totalTasks++;
    if (completed) completedTasks++;
    updateTaskCounter();
    saveTasksToLocalStorage();

    const deleteTaskBtn = taskItem.querySelector(".delete-task-btn");
    const editTaskBtn = taskItem.querySelector(".edit-task-btn");
    const taskCheckbox = taskItem.querySelector(".taskCheckbox");
    const taskName = taskItem.querySelector(".taskName");
    const taskTimestamp = taskItem.querySelector(".taskTimestamps");

    taskName.addEventListener("click", () => taskCheckbox.click());
    deleteTaskBtn.addEventListener("click", () =>deleteTask(taskCheckbox, taskItem));
    editTaskBtn.addEventListener("click", () =>editTask(taskName, taskTimestamp));
    taskCheckbox.addEventListener("change", () =>toggleCompleted(taskCheckbox, taskName));
  }
}

function deleteTask(taskCheckbox, taskItem) {
  if (taskCheckbox.checked) completedTasks--;
  taskItem.remove();
  totalTasks--;
  updateTaskCounter();
  saveTasksToLocalStorage();
}

function editTask(taskName, taskTimestamp) {
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = taskName.innerText;
  taskName.replaceWith(editInput);
  editInput.focus();

  let isEditSaved = false;

  function saveEditedTask() {
    if (isEditSaved) return;
    isEditSaved = true;

    if (editInput.value.trim()) {
      taskName.innerText = editInput.value.trim();
      editInput.replaceWith(taskName);

      if (taskTimestamp.querySelector(".editTimestamp"))
        taskTimestamp.querySelector(".editTimestamp").remove();

      const editTimestamp = document.createElement("time");
      editTimestamp.className = "editTimestamp";
      editTimestamp.innerText = `Edited: ${new Date().toLocaleString()}`;
      taskTimestamp.appendChild(editTimestamp);

      saveTasksToLocalStorage();
    } else {
      alert("Task name cannot be empty!");
      editInput.replaceWith(taskName);
    }
  }

  editInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") saveEditedTask();
  });

  editInput.addEventListener("blur",saveEditedTask);
}

function toggleCompleted(taskCheckbox, taskName) {
  taskName.classList.toggle("taskCompleted", taskCheckbox.checked);
  taskCheckbox.checked ? completedTasks++ : completedTasks--;
  updateTaskCounter();
  saveTasksToLocalStorage();
}

addTaskBtn.addEventListener("click", () => addTask());
taskInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

window.addEventListener("load", loadTasksFromLocalStorage);
