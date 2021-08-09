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
// let url2 = 'https://geocode.xyz/Hauptstr.,+57632+Berzhausen?json=1'
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
function fetchNeighbor(neighborUrl) {
    console.log(neighborUrl);
    countryClass = 'neighbour';
    fetch(neighborUrl)  // 1. kreipiamasi į WEB API
    .then(response => { return response.json(); }) // 2. laukiam, kol gausim duomenis ir juos konvertuojam į json
    .then(data => { renderCountry(data, countryClass); }) // 3. kadangi json irgi asinchroninis, tai laukiam kol konversija
    // įvyks ir tik tada svetainėje atvaizduojam inormaciją apie šalį
}

function mainCountry(country) {
    url = `https://restcountries.eu/rest/v2/name/${country}`;
    console.log(url);

    // Asinchroninė funkcija ima duomenis iš WEB API pagal pateiktą URL
//  I. Laukiam duomenų apie pagrindinę šalį
    fetch(url)
        .then(response => {
            return response.json(); // paimti duomenys konvertuojami į json
        })  // II. Tik tada, kai gaunam duomenis apie pagrindinę šalį ir jos kaimynų sąrašą, pradedam traukti duomenis apie kaimynines šalis
        .then(data => {
            console.log('Pagrindinė šalis:', data);
            data = data[0];
            renderCountry(data, countryClass);  // iškviečiu funkciją šalies duomenų atvaizdavimui
            neighbors = data.borders;   // paimu masyvą su kaimyninėmis šalimis

            for (let neighborCountry of neighbors) {    // kiekvienai kaimyninei šaliai paimu duomenis iš WEB API
                console.log('Kaimynas:', neighborCountry);
                neighborUrl = `https://restcountries.eu/rest/v2/alpha/${neighborCountry}`;
                fetchNeighbor(neighborUrl); // kviečiu funkciją duomenų paėmimui apie kaimyninę šalį
            };
        })
        .catch(error => alert (`Nėra tokios šalies, įveskite iš naujo!`));
            
        
}





