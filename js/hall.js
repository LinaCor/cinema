let seanceData = localStorage.getItem('seance');
let parseSeanceData = JSON.parse(seanceData);

let filmHead = document.querySelector('.buying__info-title');
filmHead.innerText = parseSeanceData.filmName;
let startFilm = document.querySelector('.buying__info-start');
startFilm.innerText = `Начало сеанса: ${parseSeanceData.seanceTime}`;
let hallFilm = document.querySelector('.buying__info-hall');
hallFilm.innerText = parseSeanceData.hallName;
let costStandartFilm = document.querySelector('.price-standart');
costStandartFilm.innerText = parseSeanceData.hallPriceStandart;
let costViptFilm = document.querySelector('.price-vip');
costViptFilm.innerText = parseSeanceData.hallPriceVip;

let wrapper = document.querySelector('.conf-step__wrapper');

sendRequest('POST', 'https://jscp-diplom.netoserver.ru/', `event=get_hallConfig&timestamp=${parseSeanceData.timeStampSeance}&hallId=${parseSeanceData.hallId}&seanceId=${parseSeanceData.seanceId}`, function (response) {
  if (response) {
    parseSeanceData.hallConfig = response;
  }

  wrapper.innerHTML = parseSeanceData.hallConfig;

  let chairs = document.querySelectorAll('.conf-step__row .conf-step__chair');
  let button = document.querySelector('.acceptin-button');
  button.setAttribute('disabled', true);
  button.style.cursor = 'pointer';
  let chairsSelected = document.querySelectorAll('.conf-step__row .conf-step__chair_selected');


  for (let chair of chairs) {
    chair.style.cursor = 'pointer';
    if (chair.classList.contains('conf-step__chair_taken') || chair.classList.contains('conf-step__chair_disabled')) {
      chair.style.cursor = 'default';
    }

    chair.addEventListener('click', () => {
      if (!(chair.classList.contains('conf-step__chair_taken')) && !(chair.classList.contains('conf-step__chair_disabled'))) {
        chair.classList.toggle('conf-step__chair_selected');
      }

      chairsSelected = document.querySelectorAll('.conf-step__row .conf-step__chair_selected');
      if (chairsSelected.length == 0) {
        button.setAttribute('disabled', true);
      } else {
        button.removeAttribute('disabled');
      }
    })
  }

  button.addEventListener('click', () => {
    document.location = 'payment.html';
    let selectedChair = [];
    chairsSelected.forEach((item) => {
      let rowPlaces = item.closest('.conf-step__row');
      let rowPlace = Array.from(rowPlaces.parentNode.children).indexOf(rowPlaces) + 1;
      let chairPlace = Array.from(rowPlaces.children).indexOf(item) + 1;
      let typeCost;
      if (item.classList.contains('conf-step__chair_vip')) {
        typeCost = 'vip';
      }
      if (item.classList.contains('conf-step__chair_standart')) {
        typeCost = 'standart';
      }
      selectedChair.push({ row: rowPlace, place: chairPlace, type: typeCost });
    })

    parseSeanceData.hallConfig = wrapper.innerHTML;
    parseSeanceData.aboutPlaces = selectedChair;
    localStorage.setItem('seance', JSON.stringify(parseSeanceData));
  })
})