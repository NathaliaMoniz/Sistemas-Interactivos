const taskList = [];

const loadTasks = async () => {
  try {
    const response = await fetch('/tasks/get'); // Hacer una solicitud GET al servidor para obtener el archivo tasks.json
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    
    const tasksJson = await response.json(); // Parsear la respuesta JSON
    taskList.splice(0, taskList.length, ...tasksJson); // Limpiar y cargar las tareas en el array taskList
    console.log('Tareas cargadas:', taskList);
  } catch (error) {
    console.error('Error al cargar las tareas:', error);
  }
}

const displayTasks = () => {
  const taskContainer = document.getElementById('task-container');
  taskContainer.innerHTML = ''; // Limpiar el contenedor de tareas antes de agregar las nuevas

  taskList.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    
    if (task.done) {
      taskElement.style.color = 'green';
      taskElement.style.borderColor = 'green';
    } else {
      taskElement.style.color = 'black';
      taskElement.style.borderColor = 'red';
    }
    taskElement.innerHTML = `<span>${task.title}</span>`;
    
    taskContainer.appendChild(taskElement);


  });
}

// Llamar a displayTasks() después de cargar las tareas
loadTasks().then(displayTasks);

const add = async () => {
  const taskNameInput = document.getElementById('task-name');
  const taskName = taskNameInput.value.trim(); // Obtener el nombre de la tarea del campo de texto
  
  if (taskName === '') {
    return; // No hacer nada si el campo de texto está vacío
  }
  
  // Crear un objeto de tarea con un ID único
  const newTask = {
    id: taskList.length + 1, // Usar una marca de tiempo como ID único (en una aplicación real, podrías usar un generador de IDs único)
    title: taskName,
    done: false
  };
  
  // Agregar la nueva tarea a la lista taskList
  taskList.push(newTask);
  
  // Mostrar las tareas actualizadas en pantalla
  displayTasks();
  
  // Limpiar el campo de texto después de agregar la tarea
  taskNameInput.value = '';
  console.log(taskList);
}


const addButton = document.querySelector("#fab-add");
addButton.addEventListener("click", add);

const showMessage = (message) => {
  const messageElement = document.getElementById('message');
  messageElement.textContent = message;
  messageElement.style.display = 'block';
  // Ocultar el mensaje después de unos segundos
  setTimeout(() => {
    messageElement.style.display = 'none';
  }, 1000); // Tiempo en milisegundos antes de ocultar el mensaje
}

const remove = (index) => {
  // Marcar la tarea como eliminando para activar la animación
  const taskElement = document.querySelectorAll('.task')[index];
  taskElement.classList.add('removing');
  
  // Eliminar la tarea del array taskList después de la animación
  setTimeout(() => {
    taskList.splice(index, 1);
    // Mostrar las tareas actualizadas en pantalla
    displayTasks();
    showMessage('Tarea eliminada 🗑️');
  }, 300); // Tiempo de la animación en milisegundos
  console.log(taskList);
}

// Agregar el evento de deslizamiento táctil a los elementos de tarea
const taskContainer = document.getElementById('task-container');
taskContainer.addEventListener('touchstart', handleTouchStart);
taskContainer.addEventListener('touchend', handleTouchEnd);

let startX = null; // Posición inicial X del toque
let touchStartTime = null;
function handleTouchStart(event) {
  startX = event.touches[0].clientX; // Guardar la posición inicial X del toque
  touchStartTime = Date.now(); 
}

function handleTouchEnd(event) {
  if (!startX) return; // Si startX es null, no se ha iniciado ningún deslizamiento
  
  const endX = event.changedTouches[0].clientX; // Posición final X del toque
  const diffX = endX - startX; // Diferencia entre la posición final e inicial X del toque
  
  // Si la diferencia de X es mayor que un valor umbral (por ejemplo, 50px), interpretamos como un gesto de deslizamiento
  if (Math.abs(diffX) > 50) {
    const taskElement = event.target.closest('.task');
    if (taskElement) {
      const index = Array.from(taskElement.parentNode.children).indexOf(taskElement);
      if (index !== -1) {
        remove(index); // Eliminar la tarea en el índice correspondiente
      }
    }
  }else {
    // Si no hay deslizamiento, verificar si se mantuvo el dedo durante más de dos segundos
    const touchDuration = Date.now() - touchStartTime;
    if (touchDuration >= 1000) {
      const taskElement = event.target.closest('.task');
      if (taskElement) {
        const index = Array.from(taskElement.parentNode.children).indexOf(taskElement);
        if (index !== -1) {
          toggleDone(index); // Marcar/Desmarcar la tarea como completada
        }
      }
    }
  }
  
  startX = null; // Restablecer startX para el próximo deslizamiento
}

const toggleDone = (index) => {
  
  // Alternar el estado de completado de la tarea en la lista taskList
  taskList[index].done = !taskList[index].done;
  
  if (taskList[index].done) {
    
    navigator.vibrate(20); // Vibrar durante 20 milisegundos

  } else {

    navigator.vibrate(20); 
  }
  displayTasks();
  console.log(taskList);
}

addButton.addEventListener("touchend", add);

