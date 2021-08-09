'use strict';

// Programa pagal jūsų nurodytą anglišką šalies pavadinima išveda duomenis apie šalį ir jos kaimynines šalis.
// programa sukurta bandant ir tikrinant šiuos javascript funkcionalumus:
// - Promises;
// - Duomenų paėmimas iš WEB API;

// Kadangi duomenys paimami iš kito Web serverio ir šis duomenų gavimo/apsikeitimo procesas užtruka laiko, todėl
// reikia naudoti asinchronines funkcijas ir promis'us, kurie leidžia sutvarkyti veiksmų eiliškumą, pvz. pradėti apdoroti duomenis
// tik po to, kai jie gaunami.
// Aš naudoju promisus čia 2 scenarijams:
// 1. palaukiu, kol gaunu duomnis iš WEB API ir tik tada juos išskaidau ir patalpinu savo svetainėje.
// 2. duomenis apie kaimynines šalis išvedu tik data, kai gaunu ir apdoruoju duomenis apie pagrindinę šalį.

let country = 'Lithuania';
let url = `https://restcountries.eu/rest/v2/name/${country}`;
let neighbors = '';
let neighborUrl ='';
const btn = document.querySelector('.button');
const countriesContainer = document.querySelector('.countries');
let countryClass = 'country';

mainCountry(country);

btn.addEventListener('click', function() {
    country = prompt('Įveskite šalies pavadinimą anglų kalba:')
    console.log(country);
    countriesContainer.innerHTML = '';
    countryClass = 'country';
    mainCountry(country);
});

// funkcija sukuria html kodo dalį, kuri talpins informaciją apie šalį, ir patalpiną ją į index.html 
function renderCountry(data, countryClass) {
    const html = `
    <article class="${countryClass}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(data.population / 1000000).toFixed(2)} million people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].symbol}</p>
      <p class="country__row"><span>🏛️</span>${data.capital}</p>
      <p class="country__row"><span>🌎</span>${data.region}</p>
      <p class="country__row"><span>🇪🇺</span>${data.regionalBlocs[0].name}</p>
      <p class="country__row"><span>⏰</span>${data.timezones[0]}</p> 
    </div>
  </article>
    `; 
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
}

// Funkcija paima ir atvaizduoja duomenis apie kaimynines šalis
async function fetchNeighbor(neighborUrl) {
    console.log(neighborUrl);
    countryClass = 'neighbour';
    let fetchData = await fetch(neighborUrl);
    let data = await fetchData.json();  
    renderCountry(data, countryClass);   
};

// Funkcija paima ir atvaizduoja duomenis apie pagrindinę šalis
async function mainCountry(country) {
    url = `https://restcountries.eu/rest/v2/name/${country}`;
    console.log(url);

    let fetchData = await fetch(url);
    let data = await fetchData.json();
    console.log('Pagrindinė šalis:', data);
    data = data[0];
    renderCountry(data, countryClass); 
    neighbors = data.borders;  

    for (let neighborCountry of neighbors) {  
        console.log('Kaimynas:', neighborCountry);
        neighborUrl = `https://restcountries.eu/rest/v2/alpha/${neighborCountry}`;
        fetchNeighbor(neighborUrl); 
    };        
}
