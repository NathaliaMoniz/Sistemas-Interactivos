const taskList = [];

const loadTasks = async () => {
  const response = await fetch("/tasks/get");
  const tasks = await response.json();
  
  const taskContainer = document.getElementById('task-container'); 

  // por cada tarea se crea un div para contenerla
  tasks.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.textContent = task.title;
    taskElement.className = 'task';
    taskContainer.appendChild(taskElement);
  });
}

loadTasks();

const add = () => {
  const taskNameInput = document.getElementById('task-name');
  const taskName = taskNameInput.value;
  taskNameInput.value = ''; // se limpia la barra del input

  if (taskName) {
    const taskContainer = document.getElementById('task-container');

    const taskElement = document.createElement('div');
    taskElement.textContent = taskName;
    taskElement.className = 'task';

    taskContainer.appendChild(taskElement);
    
  }
}

const addButton = document.querySelector("#fab-add");
addButton.addEventListener("click", add);

const remove = () => {}

const toggleDone = () => {}


addButton.addEventListener("touchend", add);


