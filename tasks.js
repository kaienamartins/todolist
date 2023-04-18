function uid() {
  return Date.now().toString(16) + Math.random().toString(16).substring(2);
}

let taskData = JSON.parse(localStorage.getItem('Tasks')) || [];

const addTaskInput = document.getElementById("task_input");
const addTaskButton = document.getElementsByTagName("button");
const taskList = document.getElementById("tasks_list");
const todoCounterText = document.getElementById("todo_count");
const doneCounterText = document.getElementById("done_count");
const emptyTasks = document.getElementById("empty_tasks");
function verifyIfListIsEmpty() {
  if (taskData.length === 0) {
    emptyTasks.classList.remove("hidden");
  } else {
    emptyTasks.classList.add("hidden");
  }
}

function counter() {
  let toDoCounter = 0;
  let doneCounter = 0;

  toDoCounter = taskData.length;
  todoCounterText.innerText = `${toDoCounter}`;

  for (const task of taskData) {
    if (task.toDo === false) {
      doneCounter++;
    }
  }

  doneCounterText.innerText = `${doneCounter}`;
}

verifyIfListIsEmpty();
counter();

function createNewTaskEl(taskName, taskId) {
  let task = document.createElement("li");
  task.classList.add("task");
  task.classList.add("todo");
  task.setAttribute("id", taskId);

  let leftContent = document.createElement("div");
  leftContent.classList.add("left_content");

  let todoIcon = document.createElement("i");
  todoIcon.classList.add("ph-duotone");
  todoIcon.classList.add("ph-circle-dashed");
  todoIcon.classList.add("check_btn");
  todoIcon.addEventListener("click", completeTask);

  let doneIcon = document.createElement("i");
  doneIcon.classList.add("ph-duotone");
  doneIcon.classList.add("ph-check-circle");
  doneIcon.classList.add("check_btn");
  doneIcon.classList.add("hidden");
  doneIcon.addEventListener("click", incompleteTask);

  let name = document.createElement("p");
  name.innerHTML = taskName;

  let deleteIcon = document.createElement("i");
  deleteIcon.classList.add("ph-duotone");
  deleteIcon.classList.add("ph-trash");
  deleteIcon.classList.add("delete_btn");
  deleteIcon.addEventListener("click", deleteTask);

  leftContent.appendChild(todoIcon);
  leftContent.appendChild(doneIcon);
  leftContent.appendChild(name);

  task.appendChild(leftContent);
  task.appendChild(deleteIcon);

  return task;
}

function addTask(event) {
  event.preventDefault();

  let newTaskName = addTaskInput.value;

  const newTask = {
    id: uid(),
    name: newTaskName,
    toDo: true,
  };

  taskData.push(newTask);
  const taskElement = createNewTaskEl(newTask.name, newTask.id);

  //verificação para impedir a criação de tarefas sem nome
  if (newTask.name === "" || newTask.name === undefined) {
    addTaskInput.setAttribute(
      "style",
      "border: 2px solid #DB0F27;",
      "transition: all 0.5s ease-in-out;"
    );
    alert("Você deve informar um nome para a tarefa");
    setInterval(() => {
      addTaskInput.setAttribute(
        "style",
        "border: 2px solid rgba(255,255,255,.2);",
        "transition: all 0.5s ease-in-out;"
      );
    }, 5000);
    return;
  }

  taskList.appendChild(taskElement);
  addTaskInput.value = "";
  counter();
  verifyIfListIsEmpty();
  localStorage.setItem('Tasks', JSON.stringify(taskData));
}

function completeTask(event) {
  const todoIcon = event.target;
  todoIcon.classList.add("hidden");

  const text = todoIcon.parentNode.childNodes[2];
  text.classList.add("strikethrough");

  const taskToCompletId = todoIcon.parentNode.parentNode.id;
  const taskToComplete = document.getElementById(taskToCompletId);

  taskToComplete.classList.add("done");
  taskToComplete.classList.remove("todo");

  const doneIcon = todoIcon.parentNode.childNodes[1];
  doneIcon.classList.remove("hidden");

  taskData.find((item) => {
    if (item.id === taskToCompletId) {
      item.toDo = false;
    }
  });
  counter();
}

function incompleteTask(event) {
  const doneIcon = event.target;
  doneIcon.classList.add("hidden");
  const taskToIncompleteId = doneIcon.parentNode.parentNode.id;
  const taskToIncomplete = document.getElementById(taskToIncompleteId);

  taskToIncomplete.classList.add("todo");
  taskToIncomplete.classList.remove("done");

  const todoIcon = doneIcon.parentNode.childNodes[0];
  todoIcon.classList.remove("hidden");

  taskData.find((item) => {
    if (item.id === taskToIncompleteId) {
      item.toDo = true;
    }
  });
  counter();
}

function deleteTask(event) {
  const taskToDeleteId = event.target.parentNode.id;
  const taskToDelete = document.getElementById(taskToDeleteId);

  const tasksWithoutDeletedOne = taskData.filter((task) => {
    return task.id !== taskToDeleteId;
  });

  taskData = tasksWithoutDeletedOne;
  taskList.removeChild(taskToDelete);

  counter();
  verifyIfListIsEmpty();
  //localStorage.setItem('Tasks', JSON.stringify(taskData));
}

for (const task of taskData) {
  const taskItem = createNewTaskEl(task.name, task.id);
  taskList.appendChild(taskItem);
}
