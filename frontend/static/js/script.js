// Получаем ссылки на необходимые элементы
const editButtons = document.querySelectorAll('.editRow');
const overlay = document.getElementById('overlay');
const modal = document.getElementById('change');
const closeButton = document.querySelector('.mdal__close');
const form = document.querySelector('.mdal__form');
const nameInput = document.querySelector('.mdal__form__name');
const addButton = document.getElementById('addBtn');
const dataTable = document.getElementById('data');
const newDataInput = document.getElementById('nameInput')
let editedRow; // Переменная для хранения ссылки на редактируемую строку



// Функция поиска
function search() {
    var message = document.getElementById('message');
    message.style.display = 'none';
    var searchInput = document.getElementById('search');
    var filter = searchInput.value;
    var table = document.getElementById('data');
    var rows = table.querySelectorAll('tr');
    let nnnn;
    // // Fetch запрос к API
    // fetch('/search', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ request: filter })
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     while (table.rows.length > 1) {
    //       table.deleteRow(1);
    //     }
  
    //     data.text.forEach((rowData, index) => {
    //       const newRow = document.createElement('tr');
    //       const cell = document.createElement('td');
    //       const div = document.createElement('div');
    //       const button = document.createElement('img');
    //       button.src = "img/compose.png";
  
    //       const newName = rowData.name; // Получаем новое значение из поля ввода
    //       nnnn = rowData.name;
    //       div.textContent = newName;
    //       button.classList.add('editRow');
  
    //       cell.appendChild(div);
    //       cell.appendChild(button);
    //       newRow.appendChild(cell);
    //       table.querySelector('tbody').appendChild(newRow);
  
    //       // Назначаем обработчики событий для кнопок редактирования
    //       button.addEventListener('click', openModal);
    //     });
    //   })
    //   .catch(error => {
    //     console.error('Error:', error);
    //   });
    //   alert(nnnn);
    // Fetch запрос к API
  fetch('/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ request: filter }) 
  })
  .then(response => response.json())
  .then(data => {
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  data.text.forEach(rowData => { // Исправлено: обращаемся к свойству 'text' объекта 'data'
    

    rowData.forEach(cellData => {
        const newRow = document.createElement('tr');
        const cell = document.createElement('td');
        const div = document.createElement('div');
        const button = document.createElement('img');
        button.src = "img/compose.png";

        const newName = cellData; // Получаем новое значение из поля ввода
        nnnn = cellData;
        div.textContent = newName;
        button.classList.add('editRow');

        cell.appendChild(div);
        cell.appendChild(button);
        newRow.appendChild(cell);
        table.querySelector('tbody').appendChild(newRow);

        // Назначаем обработчики событий для кнопок редактирования
        button.addEventListener('click', openModal);
    });
  });
})
  .catch(error => {
    console.error('Error:', error);
  });
}
  
  
// Функция открытия модального окна
function openModal(event) {
  editedRow = event.target.closest('tr'); // Сохраняем ссылку на редактируемую строку
  overlay.style.display = 'block';
  modal.style.display = 'block';
  nameInput.value = editedRow.querySelector('div').textContent
}

// Функция закрытия модального окна
function closeModal() {
  overlay.style.display = 'none';
  modal.style.display = 'none';
}

// Функция обработки отправки формы
function handleSubmit(event) {
  event.preventDefault();
  

  // Получаем новое значение из поля ввода
  const newName = nameInput.value;

  // Обновляем значение в соответствующей ячейке таблицы
  const cell = editedRow.querySelector('div');
  cell.textContent = newName;
  // Закрываем модальное окно
  closeModal();
}

// Функция добавления новой строки в таблицу
function addRow() {
message.style.display = 'none'
const newRow = document.createElement('tr');
const cell = document.createElement('td');
const div = document.createElement('div');
const button = document.createElement('img');
button.src = "img/compose.png";

const newName = newDataInput.value; // Получаем новое значение из поля ввода

div.textContent = newName;
button.textContent = 'OK';
button.classList.add('editRow');

cell.appendChild(div);
cell.appendChild(button);
newRow.appendChild(cell);
dataTable.querySelector('tbody').appendChild(newRow);

// Назначаем обработчики событий для кнопок редактирования
button.addEventListener('click', openModal);
}


// Назначаем обработчики событий для кнопок редактирования
editButtons.forEach(button => {
  button.addEventListener('click', openModal);
});

// Назначаем обработчик события для кнопки закрытия
closeButton.addEventListener('click', closeModal);

// Назначаем обработчик события для отправки формы
form.addEventListener('submit', handleSubmit);



// Назначаем обработчик события для кнопки добавления
addButton.addEventListener('click', function(event) {
  event.preventDefault(); // Предотвращает обновление страницы при отправке формы
  addRow();
});