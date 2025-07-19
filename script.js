const todoContainer = document.getElementById("todo-tasks");
const inProgressContainer = document.getElementById("inprogress-tasks");
const validateContainer = document.getElementById("validate-tasks");
const completeContainer = document.getElementById("complete-tasks");

let tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || {
  todo: [],
  inprogress: [],
  validate: [],
  complete: []
};

function saveTasks() {
  localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
}

function createTaskElement(text, section) {
  const div = document.createElement("div");
  div.className = "task";
  div.draggable = true;
  div.textContent = text;

  // Tick button - common utility
  const createButton = (label, handler) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.onclick = handler;
    return btn;
  };

  if (section === "todo") {
    div.appendChild(createButton("✔", () => moveTask(text, "todo", "inprogress")));

  } else if (section === "inprogress") {
        const validateBtn = createButton("✔", () => moveTask(text, "inprogress", "validate"));
        div.appendChild(validateBtn);
  } else if (section === "validate") {
    div.appendChild(createButton("✔", () => moveTask(text, "validate", "complete")));
  } else if (section === "complete") {
    div.appendChild(createButton("🗑", () => deleteTask(text, "complete")));
  }
  div.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ text, from: section }));
  });

  return div;
}

function renderTasks() {
  todoContainer.innerHTML = "";
  inProgressContainer.innerHTML = "";
  validateContainer.innerHTML = "";
  completeContainer.innerHTML = "";

  tasks.todo.forEach(task => todoContainer.appendChild(createTaskElement(task, "todo")));
  tasks.inprogress.forEach(task => inProgressContainer.appendChild(createTaskElement(task, "inprogress")));
  tasks.validate.forEach(task => validateContainer.appendChild(createTaskElement(task, "validate")));
  tasks.complete.forEach(task => completeContainer.appendChild(createTaskElement(task, "complete")));
}

function addTask() {
  const input = document.getElementById("new-task");
  const text = input.value.trim();
  if (text) {
    tasks.todo.push(text);
    input.value = "";
    saveTasks();
    renderTasks();
  }
}

function deleteTask(text, section) {
  tasks[section] = tasks[section].filter(t => t !== text);
  saveTasks();
  renderTasks();
}

function moveTask(text, from, to) {
  deleteTask(text, from);
  tasks[to].push(text);
  saveTasks();
  renderTasks();
}

document.querySelectorAll(".task-container").forEach
(container => 
{
          container.addEventListener("dragover", e => e.preventDefault());
          container.addEventListener
    ("drop", e => 
        {
         e.preventDefault();
         const data = JSON.parse(e.dataTransfer.getData("text/plain"));
         if (data && data.text && data.from)
            {
                const to = container.id.split("-")[0];
                moveTask(data.text, data.from, to);
            }
        }
    );
}
);

renderTasks();
