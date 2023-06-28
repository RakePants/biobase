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
const meanBlock = document.querySelector('.mean');
const meanWord = document.querySelector('.mean_word');
const inputsearch = document.getElementById('search');
let editedRow; // Переменная для хранения ссылки на редактируемую строку
let toDel = 0;

fetch('/number_of_entries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then(error => {
            throw new Error(error.detail);
          });
        }
      })
      .then(data => {
        // Обработка полученных данных
        var rowscount = document.querySelector('.rows_count');
        rowscount.textContent = 'Количество записей: ' + data.number_of_entries;
      })
      .catch(error => {
        console.log(error.message);
      });

//Fetchи 

function whatMean() {
meanBlock.style.display = 'block';
var filter = inputsearch.value;
fetch('/correct', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: filter.replaceAll('"', '\"') })
})
  .then(function(response) {
    if (response.ok) {
      return response.json();
    } else {
      return response.json().then(function(error) {
        throw new Error(error.detail);
      });
    }
  })
  .then(function(data) {
    // Обработка полученных данных
    meanWord.textContent = data.you_mean;
  })
  .catch(handleFetchError);
}
// Функция поиска
function search() {
  var loader = document.getElementById('loader');
  loader.style.display = 'block';
  inputsearch.blur();
  // Отображение таблицы и скрытие сообщения
  var scrollTable = document.getElementById('scroll-table-body');
  scrollTable.style.display = 'block';
  var message = document.getElementById('message');
  message.style.display = 'none';
  
  var rowscount = document.querySelector('.rows_count');
  // Получение значения для фильтрации
  var searchInput = document.getElementById('search');
  var filter = searchInput.value;
  
  // Очистка таблицы
  var table = document.getElementById('data');
  while (table.rows.length > 0) {
    table.deleteRow(table.rows.length - 1);
  }

  // Отправка запроса на сервер
  fetch('/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: filter.replaceAll('"', '\"') })
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(error => {
          throw new Error(error.detail);
        });
      }
    })
    .then(data => {
      // Обработка полученных данных
      if (data.text.length == 0) {
        // Отображение сообщения об отсутствии результатов
        message.textContent = "Ничего не найдено ¯\\_(ツ)_/¯";
        message.style.display = 'block';
        scrollTable.style.display = 'none';
        rowscount.style.display = 'none';
      } else {
          
          rowscount.textContent = 'Количество записей: ' + data.text.length;
          rowscount.style.display = 'block';
        // Создание новых строк таблицы
        data.text.forEach(rowData => {
          rowData.forEach(cellData => {
            createTableRow(cellData); // Создание строки с данными
          });
        });
      }
      loader.style.display = 'none';
    })
    .catch(handleFetchError);

}

// Функция обработки отправки формы
function handleSubmit(event) {
  event.preventDefault();
  var newName = nameInput.value;

  // Обновление значения в ячейке таблицы
  const cell = editedRow.querySelector('div');
  var oldname = cell.textContent
  
  

  // Отправка запроса на сервер для обновления данных
  fetch('/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: oldname.replaceAll('"', '\"'), new_name: newName.replaceAll('"', '\"') })
  })
    .then(response => {
      closeModal();
      if (response.ok) {
        pushNotification('Запись изменена!');
        cell.textContent = newName;
      } else {
        return response.json().then(error => {
          throw new Error(error.detail);
        });
      }
    })
    .catch(handleFetchError);
}


// Функция добавления новой строки в таблицу
function addRow() {
  const newName = newDataInput.value;

  // Отправка запроса на сервер для добавления новой записи
  fetch('/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: newName.replaceAll('"', '\"') })
  })
    .then(response => {
      if (response.ok) {
        pushNotification(newName + ' успешно добавлен!');
      } else {
        return response.json().then(error => {
          throw new Error(error.detail);
        });
      }
    })
    .catch(handleFetchError);
}
//Функция удаления строк
function delRows(){
var cells = document.querySelectorAll('td');
let dele = [];
for (let cell of cells) {
var check = cell.querySelector('.deleteRow');
if (check.checked) {
        var row = cell.parentNode;
        var div = row.querySelector('div');
        dele.push(div.textContent.replaceAll('"', '\"'));
        check.checked = true;
        
    }
}
fetch('/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: dele })
  })
    .then(response => {
      toDel = 0;
      
      if (!response.ok) 
      {
        return response.json().then(error => {
          closeDelModal();
          throw new Error(error.detail);
        });
      }
      else 
      {
          for (let cell of cells) {
            var check = cell.querySelector('.deleteRow');
            if (check.checked){
              var row = cell.parentNode;
              row.remove();
                    
            }
          }
          closeDelModal();
          pushNotification('Записи успешно удалены!');
      }
    })
    .catch(handleFetchError);
}

//Функции дополнительные

function delay(callback, delayTime) {
  var timerId;
  return function() {
    clearTimeout(timerId);
    timerId = setTimeout(function() {
      callback.apply(this, arguments);
    }, delayTime || 0);
  };
}

// Функция создания строки с данными
function createTableRow(cellData) {
  var table = document.getElementById('data');
  var newRow = document.createElement('tr');
  var cell = document.createElement('td');
  var div = document.createElement('div');
  var button = document.createElement('img');
  var check = document.createElement('input');

  check.type = 'checkbox';
  button.src = "img/compose.png";

  var newName = cellData;
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
  check.addEventListener('change', function () {
    if (check.checked) {
      toDel = toDel + 1;
      if (toDel == 1) {
        del();
      }
    } else {
      toDel = toDel - 1;
      if (toDel == 0) {
        closeDelModal();
      }
    }
  });
}

// Функция открытия модального окна
function openModal(event) {
  editedRow = event.target.closest('tr');
  overlay.style.display = 'block';
  modal.style.display = 'block';
  nameInput.value = editedRow.querySelector('div').textContent;
}

// Функция закрытия модального окна
function closeModal() {
  overlay.style.display = 'none';
  modal.style.display = 'none';
}




// Функция обработки ошибок при выполнении запросов
function handleFetchError(error) {
  var loader = document.getElementById('loader');
  loader.style.display = 'none';
  pushNotification('Ошибка: ' + error.message);
}

// Функция удаления записей
function del() {
  var del = document.getElementById("delete");
  del.classList.add("delete_active");
}

// Функция закрытия режима удаления
function closeDelModal() {
  var del = document.getElementById("delete");
  del.classList.remove("delete_active");
  // Снимаем отметки с чекбоксов
  var cells = document.querySelectorAll('td');
  for (let cell of cells) {
    var check = cell.querySelector('.deleteRow');
    if (check.checked) {
      check.checked = false;
    }
  }
  toDel = 0;
}

// Функция вывода уведомления
function pushNotification(text) {
  const pushContainer = document.createElement('div');
  pushContainer.className = 'push';
  pushContainer.id = 'push';

  const messageContainer = document.createElement('div');
  messageContainer.className = 'push_message';

  pushContainer.appendChild(messageContainer);

  const parentElement = document.getElementById('notification');
  const existingNotifications = parentElement.getElementsByClassName('push');
  if (existingNotifications.length > 0) {
    for (let i = 0; i < existingNotifications.length; i++) {
      const notification = existingNotifications[i];
      notification.style.bottom = `${70 + (i * 20)}px`;
    }
  }

  parentElement.appendChild(pushContainer);

  messageContainer.textContent = text;
  setTimeout(function () {
    pushContainer.classList.add('push_active');
  }, 1);
  setTimeout(function () {
    pushContainer.remove();
  }, 7000);
}

// Назначение обработчиков событий
meanWord.addEventListener('click', function(){
  inputsearch.value = meanWord.textContent;
  search();
});
// Кнопки редактирования
editButtons.forEach(button => {
    button.addEventListener('click', openModal);
  });
  
// Кнопка закрытия модального окна
closeButton.addEventListener('click', closeModal);

// Отправка формы
form.addEventListener('submit', handleSubmit);

// Кнопка добавления записи
addButton.addEventListener('click', function (event) {
  event.preventDefault();
  addRow();
});

// Кнопка удаления
remDel.addEventListener('click', function () {
  delRows();
});

// Закрытие режима удаления
closDel.addEventListener('click', function () {
  closeDelModal();
});

inputsearch.addEventListener('keyup', delay(whatMean, 200));

inputsearch.addEventListener('blur', function(){
  setTimeout(function() {
    meanBlock.style.display = 'none';
  }, 150); 
})

inputsearch.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    search();
  }
});
