// Функция поиска
function search() {
    // Отображение таблицы и скрытие сообщения
    var scrollTable = document.getElementById('scroll-table-body');
    scrollTable.style.display = 'block';
    var message = document.getElementById('message');
    message.style.display = 'none';
  
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
        } else {
          // Создание новых строк таблицы
          data.text.forEach(rowData => {
            rowData.forEach(cellData => {
              createTableRow(cellData); // Создание строки с данными
            });
          });
        }
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
    
    fetch('/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: dele })
    })
      .then(response => {
        toDel = 0;
        closeDelModal();
        if (!response.ok) 
        {
          return response.json().then(error => {
            throw new Error(error.detail);
          });
        }
        else 
        {
            var cells = document.querySelectorAll('td');
            let dele = [];
            for (let cell of cells) {
            var check = cell.querySelector('.deleteRow');
            if (check.checked) {
                    var row = cell.parentNode;
                    var div = row.querySelector('div');
                    dele.push(div.textContent.replaceAll('"', '\"'));
                    row.parentNode.removeChild(row);
                }
            }
            pushNotification('Записи успешно удалены!');
        }
      })
      .catch(handleFetchError);
  }
  