// Obtém referências para os elementos HTML relevantes
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const showHiddenButton = document.getElementById('showHiddenButton');

// Função para carregar as tarefas do armazenamento local
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  savedTasks.forEach(task => {
    createTaskElement(task);
  });
}

// Função para adicionar uma nova tarefa
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText !== '') {
    const task = { id: Date.now(), text: taskText };
    createTaskElement(task);
    saveTasks();
    taskInput.value = '';
  }
}

// Função para criar um elemento de tarefa
function createTaskElement(task) {
  const li = document.createElement('li');
  li.dataset.id = task.id; // Armazenar o ID da tarefa como um atributo de dados
  li.innerHTML = `<span>${task.text}</span>` + 
    '<button onclick="editTask(this)">Editar</button>' +
    '<button onclick="hideTask(this)">Ocultar</button>';
  taskList.appendChild(li);
}

// Função para editar uma tarefa
function editTask(button) {
  const li = button.parentElement;
  const newText = prompt('Editar tarefa:', li.querySelector('span').textContent);
  if (newText !== null && newText.trim() !== '') {
    li.querySelector('span').textContent = newText.trim();
    saveTasks();
  }
}

// Função para ocultar uma tarefa apenas se estiver marcada como concluída
function hideTask(button) {
  const li = button.parentElement;
  // Verifica se a tarefa está marcada como concluída
  if (li.classList.contains('completed')) {
    li.style.display = 'none';
    saveTasks();
  } else {
    alert('Você só pode ocultar uma tarefa concluída.');
  }
}

// Função para mostrar tarefas ocultas
function showHiddenTasks() {
  const hiddenTasks = document.querySelectorAll('#taskList li[style="display: none;"]');
  hiddenTasks.forEach(task => {
    task.style.display = 'block';
  });
}

// Função para salvar as tarefas no armazenamento local
function saveTasks() {
  const tasks = [];
  const taskElements = taskList.getElementsByTagName('li');
  for (let i = 0; i < taskElements.length; i++) {
    const taskText = taskElements[i].querySelector('span').textContent.trim();
    const taskId = taskElements[i].dataset.id;
    tasks.push({ id: taskId, text: taskText });
  }
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Adiciona um listener de evento para marcar tarefas como completas
taskList.addEventListener('click', function(event) {
  if (event.target.tagName === 'SPAN') {
    event.target.parentElement.classList.toggle('completed');
    saveTasks();
  }
});

// Adiciona um listener de evento para mostrar tarefas ocultas
showHiddenButton.addEventListener('click', showHiddenTasks);

// Carrega as tarefas ao carregar a página
loadTasks();