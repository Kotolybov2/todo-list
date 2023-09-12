// находим элементы на странице 
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');


let tasks = localStorage.length === 0 ? [] : [localStorage.getItem('tasks')];


if(localStorage.getItem('tasks')) {
   tasks = JSON.parse(localStorage.getItem('tasks'));
}

tasks.forEach(function(task) {
    // Формируем css класс
const cssClass = task.done ? "task-title task-title--done" : 'task-title';

// Формируем разметку для новой задачи
const taskHTML = `
<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
<span class="${cssClass}">${task.text}</span>
<div class="task-item__buttons">
   <button type="button" data-action="done" class="btn-action">
       <img src="./img/tick.svg" alt="Done" width="18" height="18">
   </button>
   <button type="button" data-action="delete" class="btn-action">
       <img src="./img/cross.svg" alt="Done" width="18" height="18">
   </button>
</div>
</li>`
// Добавляем на страницу 
tasksList.insertAdjacentHTML('beforeend', taskHTML);
});


form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)
checkEmptyList();

// Функции
function addTask (event){
     // Отменил отправку формы
    event.preventDefault();

// Достаем текст задачи из поля ввода 
const taskText = taskInput.value

const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
};

// Добавление задачи в массив с задачами
tasks.push(newTask)

// Сохранение списка задач в хранилище LocalStorage 
saveToLocalStorage();

// Формируем css класс
const cssClass = newTask.done ? "task-title task-title--done" : 'task-title';

// Формируем разметку для новой задачи
const taskHTML = `
<li id="${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
<span class="${cssClass}">${newTask.text}</span>
<div class="task-item__buttons">
   <button type="button" data-action="done" class="btn-action">
       <img src="./img/tick.svg" alt="Done" width="18" height="18">
   </button>
   <button type="button" data-action="delete" class="btn-action">
       <img src="./img/cross.svg" alt="Done" width="18" height="18">
   </button>
</div>
</li>`
// Добавляем на страницу 
tasksList.insertAdjacentHTML('beforeend', taskHTML);
// Очищаем поле ввода и возвращаем на него фокус 

taskInput.value = ""
taskInput.focus()

checkEmptyList();


}

function deleteTask(event) {    
    // Проверяем если клик был НЕ по кнопке "удалить задачу"

    if (event.target.dataset.action !== 'delete'){
        return
    }

        const parenNode = event.target.closest('.list-group-item');

        // Определяем ID задачи
        const id = Number(parenNode.id);

        // Находим индекс задачи в массиве
        const index = tasks.findIndex(function (task){
            return task.id === id;
        });

        // удаление задачи из массива с задачами
        tasks.splice(index, 1)

        // Сохранение списка задач в хранилище LocalStorage 
        saveToLocalStorage();


        // удаляем задачу из разметки
        parenNode.remove();

        checkEmptyList();
}

function doneTask(event){
    // Проверяем что клик НЕ был по кнопке "Задача выполнена"
    if(event.target.dataset.action !== 'done'){
        return
    }
    const parentNode = event.target.closest('.list-group-item');

    const id = Number(parentNode.id);

     const task = tasks.find(function (task){
        if(task.id === id) {
            return true
        }
    })

    // Смена статуса на обратный
    task.done = !task.done

    // Сохранение списка задач в хранилище LocalStorage 
    saveToLocalStorage();

    
    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList(){
    if(tasks.length === 0){
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
    </li>`;
       tasksList.insertAdjacentHTML('afterbegin',emptyListHTML);

    }
    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}


 

 