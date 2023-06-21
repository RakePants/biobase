// Назначение обработчиков событий

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