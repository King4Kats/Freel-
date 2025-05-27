const { ipcRenderer } = require('electron');

let tasks = [];

try {
  tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
} catch (error) {
  console.error('Erreur lors du chargement des tâches:', error);
  tasks = [];
}

function saveTasks() {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des tâches:', error);
  }
}

function renderTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.dataset.index = index;

    const label = document.createElement('label');
    label.textContent = `${task.text} - 🗓 ${task.date}`;

    li.appendChild(checkbox);
    li.appendChild(label);
    list.appendChild(li);
  });
}

function addTask() {
  const text = document.getElementById('taskInput').value.trim();
  const date = document.getElementById('dateInput').value;

  if (text && date) {
    tasks.push({ text, date });
    saveTasks();
    renderTasks();
    document.getElementById('taskInput').value = '';
    document.getElementById('dateInput').value = '';
  } else {
    alert('Veuillez saisir une tâche et une date');
  }
}

function deleteSelectedTasks() {
  const checkboxes = document.querySelectorAll('#taskList input[type="checkbox"]');
  const toDelete = [];

  checkboxes.forEach((cb) => {
    if (cb.checked) {
      toDelete.push(parseInt(cb.dataset.index, 10));
    }
  });

  tasks = tasks.filter((_, idx) => !toDelete.includes(idx));
  saveTasks();
  renderTasks();
}

function openTimer() {
  ipcRenderer.send('open-timer');
}

// Initialisation
renderTasks();
