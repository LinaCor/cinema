let halls = [];

function getCurrentDate() {
  let navigation = document.querySelector('.page-nav');
  let date = new Date();
  let currentDay = date.getDate();
  let newDate = new Date();

  let arrayDay = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
  for (let i = 0; i < arrayDay.length - 1; i++) {
    if (date.getDay() === i) {
      let createNavFirst =
        `<a class="page-nav__day page-nav__day_today page-nav__day_chosen" href="#">
          <span class="page-nav__day-week">${arrayDay[date.getDay()]}</span><span class="page-nav__day-number">${currentDay}</span>
        </a>`
      navigation.insertAdjacentHTML('afterBegin', createNavFirst);
    }

    let nextDay = newDate.getDate(newDate.setSeconds(newDate.getSeconds() + 24 * 60 * 60));
    let createNav =
      `<a class="page-nav__day" href="#">
        <span class="page-nav__day-week">${arrayDay[newDate.getDay()]}</span><span class="page-nav__day-number">${nextDay}</span>
      </a>`
    navigation.insertAdjacentHTML('beforeEnd', createNav);
  }

  let allDay = document.querySelectorAll('.page-nav__day');
  let timeStampCounter = 0;
  for (let day of allDay) {
    const dataStamp = new Date();
    //let selectedIndex = arrayDay.indexOf(arrayDay[date.getDay()]);
    dataStamp.setDate(dataStamp.getDate());
    //dataStamp.setDate(dataStamp.getDate() + selectedIndex);
    dataStamp.setHours(0, 0, 0);
    dataStamp.setDate(dataStamp.getDate() + timeStampCounter);
    day.setAttribute('data-time-stamp', Math.floor(dataStamp.getTime() / 1000));

    timeStampCounter++;

    let weekDay = day.querySelector('.page-nav__day-week');
    if (weekDay.textContent == 'сб' || weekDay.textContent == 'вс') {
      day.classList.add('page-nav__day_weekend');
    }

    day.addEventListener('click', (event) => {
      event.preventDefault();
      for (let otherWeek of allDay) {
        otherWeek.classList.remove('page-nav__day_chosen');
      }
      day.classList.add('page-nav__day_chosen');

      pastSeances();
    })
  }
}

getCurrentDate();


sendRequest('POST', 'https://jscp-diplom.netoserver.ru/', 'event=update', function (response) {
  let main = document.querySelector('main');
  let films = response.films.result;
  let seance = response.seances.result;
  halls = response.halls.result.filter((hallOpen) => hallOpen.hall_open !== '0');

  for (let film of films) {
    let hallSeanse = '';
    halls.forEach(function (hall) {
      let sncs = seance.filter((seanses) => (seanses.seance_filmid == film.film_id) && (seanses.seance_hallid == hall.hall_id))

      if (sncs.length > 0) {
        hallSeanse += `
          <div class="movie-seances__hall">
          <h3 class="movie-seances__hall-title">${hall.hall_name}</h3>
            <ul class="movie-seances__list">
            ${sncs.map(seanc => `
            <li class="movie-seances__time-block">
              <a class="movie-seances__time" data-film-name ="${film.film_name}"
              data-seance-start="${seanc.seance_start}" data-seance-time="${seanc.seance_time}"
              data-hall-name="${hall.hall_name}" data-hall-id="${hall.hall_id}" data-seance-id="${seanc.seance_id}"
              data-hall-price-standart="${hall.hall_price_standart}"
              data-hall-price-vip="${hall.hall_price_vip}">${seanc.seance_time}</a>
              </li>
            `)}
            </ul>
          </div> `
      }
    });

    if (hallSeanse) {
      let createSection = `
          <section class="movie">
            <div class="movie__info">
              <div class="movie__poster">
                <img class="movie__poster-image" alt="${film.film_name} постер" src=${film.film_poster}>
              </div>
              <div class="movie__description">
                <h2 class="movie__title">${film.film_name}</h2>
                <p class="movie__synopsis">${film.film_description}</p>
                <p class="movie__data">
                  <span class="movie__data-duration">${film.film_duration}</span>
                  <span class="movie__data-origin">${film.film_origin}</span>
                </p>
              </div>
            </div>
            ${hallSeanse}
          </section>
        `

      main.insertAdjacentHTML('afterBegin', createSection);
    }
  }

  pastSeances();
});


function pastSeances() {
  let seances = document.querySelectorAll('.movie-seances__time');
  let selectedDay = document.querySelector('.page-nav__day_chosen');
  let startDay = Number(selectedDay.getAttribute('data-time-stamp'));

  for (let seance of seances) {
    let timeStart = seance.getAttribute('data-seance-start');
    let timeDayCurrent = startDay + timeStart * 60;

    seance.setAttribute('data-time-stamp-seance', timeDayCurrent);

    let nowDate = new Date();
    let actualSeconds = Math.floor(nowDate.getTime() / 1000);
    let seanceBeggin = Number(seance.getAttribute('data-time-stamp-seance'));

    if (actualSeconds >= seanceBeggin) {
      seance.setAttribute('href', 'javascript:void(0)');
      seance.style.background = '#bfbbbb';
      seance.style.cursor = 'default ';
    } else {
      seance.style.background = '#fff';
      seance.style.cursor = 'pointer';
      seance.setAttribute('href', 'hall.html');
    }

    seance.addEventListener('click', (event) => {
      let choseData = event.target.dataset;
      let selectHall = halls.find((hall) => hall.hall_id == choseData.hallId)
      let selectedSeanceInfo = {
        ...choseData,
        hallConfig: selectHall.hall_config
      }

      localStorage.setItem('seance', JSON.stringify(selectedSeanceInfo));
    })
  }
}











