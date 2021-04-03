let preloader = document.querySelector('.preloader'),
  input = document.querySelector('#filter-table'),
  help = document.querySelector('.filter__help'),
  buttonReset = document.querySelector('.filter__btn');

//построение таблицы
function buildingTable(data) {
  const tbody = document.querySelector('tbody');

  //форматирование даты если ответ меньше 10 символов
  function dateFormatting(date) {
    const day = ('0' + date.getDate()).slice(-2),
      month = ('0' + (date.getMonth() + 1)).slice(-2),
      year = date.getFullYear();

    return day + '.' + month + '.' + year
  }

  //создание строк
  for (let i = 0; i < data.length; i++) {
    const dataUser = data[i],
      tr = document.createElement('tr');

    //создание ячеек внутри строки
    for (let j = 0; j < 6; j++) {
      const td = document.createElement('td'),
        imgThumbnail = document.createElement('img'),
        imglarge = document.createElement('img');

      imgThumbnail.src = dataUser.picture.thumbnail;
      imglarge.src = dataUser.picture.large;
      imglarge.classList.add('tooltip');

      //первой ячейке добавляем имя и фамилию
      j == 0 ? td.textContent = dataUser.name.first + ' ' + dataUser.name.last : null;
      //второй ячейке добавлям маленькую фотографию и большую для ховера
      if (j == 1) {
        td.append(imgThumbnail);
        td.append(imglarge);
      }
      //третьей ячейке добавляем штат и город
      j == 2 ? td.textContent = dataUser.location.state + ' ' + dataUser.location.city : null;
      //четвертой ячейке добавляем почту
      j == 3 ? td.textContent = dataUser.email : null;
      //пятой ячейке добавляем телефон
      j == 4 ? td.textContent = dataUser.phone : null;
      //шестой ячейке добавляем отформатированную дату
      if (j == 5) {
        let date = new Date(dataUser.registered.date);
        td.textContent = dateFormatting(date);
      }
      tr.append(td);
    }
    tbody.append(tr);
  }
}

//запрос на сервер
fetch('https://randomuser.me/api/?results=15')
  .then(response => response.json())
  .then(data => buildingTable(data.results))
  .then(() => {
    setTimeout(() => {
      preloader.classList.add('preloader-none')
    }, 1000);
  })

//фильтрация таблицы по имени
let tableFilter = function myFunction() {
  let filter, table, tr, td, i, txtValue;
  filter = input.value.toUpperCase();
  table = document.getElementById("table");
  tr = table.getElementsByTagName("tr");
  let visibleTr = [];

  // перебирает все строки таблицы и скрывает тех, кто не соответствует поисковому запросу
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];

    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }

    if (tr[i].style.display == '') {
      visibleTr.push(tr[i]);
    }
  }

  //если количество строк равно 1, показываем сообщение что ничего не найдено
  if (visibleTr.length == 1) {
    help.classList.add('block');
  } else {
    help.classList.remove('block')
  }
}

//при вводе в input фильтруем таблицу
input.addEventListener('keyup', tableFilter);

//по клику кнопки обновляем таблицу
buttonReset.onclick = function () {
  input.value = '';
  return tableFilter();
}