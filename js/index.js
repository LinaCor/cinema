function getCurrentDate() {
  let navigation = document.querySelector('.page-nav');
  let date = new Date();
  let currentDateIndex = date.getDay();
  let currentDay = date.getDate();

  let arrayDay = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

  for (let i = 0; i < arrayDay.length - 1; i++) {
    if (arrayDay.indexOf(arrayDay[date.getDay()]) == currentDateIndex) {
      let createNavFirst = `
      <a class="page-nav__day page-nav__day_today page-nav__day_chosen" href="#">
      <span class="page-nav__day-week">${arrayDay[date.getDay()]}</span><span class="page-nav__day-number">${currentDay}</span>
      </a>
      `
      navigation.insertAdjacentHTML('afterBegin', createNavFirst);
    }

    date.setSeconds(date.getSeconds() + 24 * 60 * 60);
    let nextDay = date.getDate();
    let createNav = `
      <a class="page-nav__day" href="#">
        <span class="page-nav__day-week">${arrayDay[date.getDay()]}</span><span class="page-nav__day-number">${nextDay}</span>
      </a>
      `
    navigation.insertAdjacentHTML('beforeEnd', createNav);
  }

  let allDay = document.querySelectorAll('.page-nav__day');
  for (let day of allDay) {
    let weekDay = day.querySelector('.page-nav__day-week');
    if (weekDay.textContent == 'сб' || weekDay.textContent == 'вс') {
      day.classList.add('page-nav__day_weekend');
    }


    day.addEventListener('click', (event) => {
      let xxx = day.querySelector('.page-nav__day-number').textContent;
      event.preventDefault();
      for (let otherWeek of allDay) {
        otherWeek.classList.remove('page-nav__day_chosen');
      }
      day.classList.add('page-nav__day_chosen');

    })
  }
}

getCurrentDate();



sendRequest('POST', 'https://jscp-diplom.netoserver.ru/', 'event=update', function (response) {
  let main = document.querySelector('main');
  let films = response.films.result;
  let seance = response.seances.result;
  let halls = response.halls.result.filter((hallOpen) => hallOpen.hall_open !== '0');

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
              <a class="movie-seances__time" href="hall.html" data-film-name ="${film.film_name}"
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
  for (let seance of seances) {
    let timeStart = seance.getAttribute('data-seance-start');
    let nowDate = new Date();

    let actualMinute = (nowDate.getHours() * 60) + nowDate.getMinutes();
    if (Number(timeStart) <= actualMinute) {
      seance.setAttribute('href', 'javascript:void(0)');
      seance.style.background = '#bfbbbb';
      seance.style.cursor = 'default ';
    }
  }
}










