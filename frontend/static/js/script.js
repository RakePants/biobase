// Получаем ссылки на необходимые элементы
const editButtons = document.querySelectorAll('.editRow');
const overlay = document.getElementById('overlay');
const modal = document.getElementById('change');
const closeButton = document.querySelector('.mdal__close');
const form = document.querySelector('.mdal__form');
const nameInput = document.querySelector('.mdal__form__name');
const addButton = document.getElementById('addBtn');
const dataTable = document.getElementById('data');
const newDataInput = document.getElementById('nameInput');
const closDel = document.getElementById('delete_close');
const remDel = document.getElementById('delete_remove');
let editedRow; // Переменная для хранения ссылки на редактируемую строку
let toDel = 0;


// Функция поиска
function search() {
    var scrollTable = document.getElementById('scroll-table-body');
    scrollTable.style.display = 'block';
    var message = document.getElementById('message');
    message.style.display = 'none';
    var searchInput = document.getElementById('search');
    var filter = searchInput.value;
    var table = document.getElementById('data');
    var rows = table.querySelectorAll('tr');
    fetch('/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ request: filter.replaceAll('"', '\"') }) 
    })
    .then(response => response.json())
    .then(data => {
    while (table.rows.length > 0) {
      table.deleteRow(table.rows.length - 1);
    }
    if(data.text.length == 0){
      message.textContent = "Ничего не найдено ¯\\_(ツ)_/¯";
      message.style.display = 'block';
      scrollTable.style.display = 'none';
    }
    else{
    data.text.forEach(rowData => { // Исправлено: обращаемся к свойству 'text' объекта 'data'
      
  
      rowData.forEach(cellData => {
          const newRow = document.createElement('tr');
          const cell = document.createElement('td');
          const div = document.createElement('div');
          const button = document.createElement('img');
          const check = document.createElement('input');
          check.type = 'checkbox';
          button.src = "img/compose.png";
  
          var newName = cellData; // Получаем новое значение из поля ввода
          div.textContent = newName;
          check.classList.add('deleteRow');
          button.classList.add('editRow');
  
          cell.appendChild(div);
          cell.appendChild(button);
          cell.appendChild(check);


          newRow.appendChild(cell);
          table.querySelector('tbody').appendChild(newRow);
  
          // Назначаем обработчики событий для кнопок редактирования
          button.addEventListener('click', openModal);
          check.addEventListener('change', function() {
            if(check.checked){
              toDel = toDel + 1;
              if(toDel == 1) {
                del();
              }
            }
            else{
              toDel = toDel - 1;
              if(toDel == 0){
                closeDel();
              }
            }
          });
      });
    });
    }
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
  var newName = nameInput.value;
 
  // Обновляем значение в соответствующей ячейке таблицы
  const cell = editedRow.querySelector('div');
  var oldname = cell.textContent.replaceAll('"', '\"');
  cell.textContent = newName;
  newName = newName.replaceAll('"', '\"');
  fetch('/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: oldname, new_name: newName })
  })
  
  // Закрываем модальное окно
  closeModal();
}

// Функция добавления новой строки в таблицу
function addRow() {
const push = document.getElementById('push');
const mes = push.querySelector('.push_message');

const newName = newDataInput.value; // Получаем новое значение из поля ввода

fetch('/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: newName.replaceAll('"', '\"')})
})
.then(response => {
  if (response.ok) {
    // Обработка успешного выполнения запроса
    return response.json();
  } else {
    // Обработка неуспешного выполнения запроса
    throw new Error('Request failed');
  }
})
.then(data => {
  mes.textContent = newName + " успешно добавлен!";
  push.classList.add('push_active');
  setTimeout(function() {
    push.classList.remove('push_active');
  }, 5100);
})
.catch(error => {
  // Действия при возникновении ошибки
  console.error(error);
});


}

function del(){
  var del = document.getElementById("delete");
  del.classList.add("delete_active");
 

}

function closeDel() {
  var del = document.getElementById("delete");
  del.classList.remove("delete_active");
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

remDel.addEventListener('click', function(){
  var cells = document.querySelectorAll('td');
  let dele = []
  for(let cell of cells){
    var check = cell.querySelector('.deleteRow');
    if(check.checked){
      var row = cell.parentNode;
      var div = row.querySelector('div');
      dele.push(div.textContent.replaceAll('"', '\"'));
      row.parentNode.removeChild(row);
    }
  }
  fetch('/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: dele})
  })
  toDel = 0;
  closeDel();
  
})

closDel.addEventListener('click', function(){
  var cells = document.querySelectorAll('td');
  for(let cell of cells){
    var check = cell.querySelector('.deleteRow');
    if(check.checked){
      check.checked = false;    
    }
  }
  toDel = 0;
  closeDel();
})
