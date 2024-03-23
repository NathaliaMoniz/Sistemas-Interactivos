const taskList = [];

// Inicializar tareas
const loadTasks = async () => {
  try {

    // Obtener el archivo json
    const response = await fetch('/tasks/get'); 
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    
    const tasksJson = await response.json(); 

    // Insertar las tareas en el array 
    taskList.splice(0, taskList.length, ...tasksJson); 
    console.log('Tareas cargadas:', taskList);
  } catch (error) {
    console.error('Error al cargar las tareas:', error);
  }
}

// Realtar tarea añadida
const Resaltar = () => {
  const taskContainer = document.getElementById('task-container');

  // Se obtiene la última tarea añadida
  const newTaskElement = taskContainer.lastChild; 
  
  // Clase para resaltar la tarea
  newTaskElement.classList.add('highlight');
  
  // Eliminar la clase despues de 1000 milisegundos
  setTimeout(() => {
    newTaskElement.classList.remove('highlight');
  }, 1000); 
}

// Mostrar tarea
const displayTasks = () => {
  const taskContainer = document.getElementById('task-container');

  // Se limpia el contenedor de tareas antes de agregar las nuevas
  taskContainer.innerHTML = ''; 

  // Por cada tarea en la lista
  taskList.forEach(task => {

    // Se crea un div que contiene la tarea
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    
    // Si la tarea está marcada como hecha
    if (task.done) {
      // Se colorea de verde su contenedor
      taskElement.style.color = 'green';
      taskElement.style.borderColor = 'green';
    } 
    // Si no
    else {
      // Vuelve a sus colores iniciales
      taskElement.style.color = 'black';
      taskElement.style.borderColor = 'red';
    }

    // Se añade el nombre de la tarea al contenedor
    taskElement.innerHTML = `<span>${task.title}</span>`; 
    taskContainer.appendChild(taskElement);
  });
}

// Se cargan las tareas
loadTasks().then(displayTasks);

// Añadir tarea
const add = async () => {

  // Obtener el nombre de la tarea del input
  const taskNameInput = document.getElementById('task-name');
  const taskName = taskNameInput.value.trim(); 
  
  // No se añade nada si el campo de texto está vacío
  if (taskName === '') {
    return; 
  }
  
  // Crear un objeto de tarea 
  const newTask = {
    id: taskList.length + 1, 
    title: taskName,
    done: false
  };
  
  // Agregar la nueva tarea a la lista taskList
  taskList.push(newTask);
  
  // Mostrar las tareas 
  displayTasks();
  
  // Resaltar la tarea
  Resaltar();

  // Limpiar el input después de agregar la tarea
  taskNameInput.value = '';
  console.log(taskList);
}


const addButton = document.querySelector("#fab-add");
addButton.addEventListener("click", add);

// Mostrar mensaje de tarea eliminada
const showMessage = (message) => {

  // Se obtiene el div 'message'
  const messageElement = document.getElementById('message');

  // Rellenar con el mensaje a mostrar 
  messageElement.textContent = message;
  messageElement.style.display = 'block';

  // Borrar el mensaje después de 1000 milisegundos
  setTimeout(() => {
    messageElement.style.display = 'none';
  }, 1000); 
}

// Eliminar tarea
const remove = (index) => {

  // Marcar la tarea como eliminando para activar la animación
  const taskElement = document.querySelectorAll('.task')[index];

  // Se añade la clase 'removing' 
  taskElement.classList.add('removing');
  
  // Eliminar la tarea del array taskList después de la animación
  setTimeout(() => {
    taskList.splice(index, 1);

    // Mostrar las tareas 
    displayTasks();

    // Mostrar mesaje de tarea eliminada
    showMessage('Tarea eliminada 🗑️');
  }, 300); 

  // Imprimir la lista despues de eliminar una tarea para verificar que se elimino correctamente
  console.log(taskList);
}

// Agregar el evento de swipe a las tareas
const taskContainer = document.getElementById('task-container');
taskContainer.addEventListener('touchstart', handleTouchStart);
taskContainer.addEventListener('touchend', handleTouchEnd);

// Posición inicial del toque
let startX = null; 

// Tiempo inicial del toque
let touchStartTime = null;

function handleTouchStart(event) {

  // Guardar la posición inicial del toque
  startX = event.touches[0].clientX; 

  // Guardar tiempo inicial del toque
  touchStartTime = Date.now(); 
}

function handleTouchEnd(event) {
  // Si startX es null, no se ha iniciado ningún deslizamiento
  if (!startX) return; 
  
  // Posición final del toque
  const endX = event.changedTouches[0].clientX; 

  // Diferencia entre la posición final e inicial 
  const diffX = endX - startX; 
  
  // Si la diferencia de X es mayor que 50px es un gesto de deslzaminto
  if (Math.abs(diffX) > 50) {
    const taskElement = event.target.closest('.task');
    if (taskElement) {
      const index = Array.from(taskElement.parentNode.children).indexOf(taskElement);
      if (index !== -1) {

        // Eliminar la tarea en el índice correspondiente
        remove(index); 
      }
    }
  }
  else {
    // Si no hay deslizamiento, verificar si se mantuvo el dedo durante más de dos segundos
    const touchDuration = Date.now() - touchStartTime;
    if (touchDuration >= 2000) {
      const taskElement = event.target.closest('.task');
      if (taskElement) {
        const index = Array.from(taskElement.parentNode.children).indexOf(taskElement);
        if (index !== -1) {

          // Marcar o desmarcar la tarea como completada
          toggleDone(index); 
        }
      }
    }
  }
  
  // Restablecer startX 
  startX = null; 
}

const toggleDone = (index) => {
  
  // Cambiar el estado de 'hecho' de la tarea
  taskList[index].done = !taskList[index].done;
  
  // Si la tarea está hecha
  if (taskList[index].done) {
    
    // Vibrar durante 20 milisegundos
    navigator.vibrate(20); 

  } 
  else {

    // Vibrar durante 20 milisegundos
    navigator.vibrate(20); 
  }

  // Mostrar las tareas
  displayTasks();

  // Imprimir la lista de tareas para verificar que se ha modificado el campo de 'done'
  console.log(taskList);
}

addButton.addEventListener("touchend", add);

