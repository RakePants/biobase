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