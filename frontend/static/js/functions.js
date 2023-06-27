function delay(callback, delayTime) {
  var timerId;
  return function() {
    clearTimeout(timerId);
    timerId = setTimeout(function() {
      callback.apply(this, arguments);
    }, delayTime || 0);
  };
}
function meanBlur(){
  meanBlock.style.display = 'none';
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
  }, 2500);
}





