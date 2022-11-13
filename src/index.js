import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from "lodash.debounce";
import { fetchCountries } from "./fetchCountries";

const inputRef = document.querySelector("#search-box");
const countryListRef = document.querySelector(".country-list");
const countryInfoRef = document.querySelector(".country-info");

const DEBOUNCE_DELAY = 300;
const MAX_COUNTRY_NUMBER = 10;

function clearField() {
    countryListRef.innerHTML = "";
    countryInfoRef.innerHTML = ""; 
}

inputRef.addEventListener("input", debounce(onCountryInput, DEBOUNCE_DELAY));

function onCountryInput(event){
    const inputValue = event.target.value.trim();
    
    if (inputValue === "") {
        clearField();
        return
    };
        
    fetchCountries(inputValue)
        .then((countryData) => renderCountries(countryData))
        .catch((error) => {
            if (error.message === "404") {
                return Notify.failure("Oops, there is no country with that name")
            }
        }
    );
};

function renderCountries(countryData) {
    console.log(countryData)

    if (countryData.length >= MAX_COUNTRY_NUMBER) {
        return Notify.info("Too many matches found. Please enter a more specific name.");
    } else if (countryData.length <= MAX_COUNTRY_NUMBER) {
        markupCountries(countryData);       
    }  
};

function markupCountries(data) {
    let markup = "";
    const oneCountry = data.length === 1;

    clearField();

    const fontSize = oneCountry ? '48px' : '30px';
    const fontWeight = oneCountry ? '700' : '400';

    markup = data
    .map(({ name, flags }) => {
        return `<li class="country-list-item">
        <img class="country-flag"src="${flags.svg}" alt="Flag: ${name.official}">
        <h2 style="font-weight:${fontWeight}; font-size:${fontSize}">${name.official}</h2>         
        </li>`;
    })
        .join("");
    countryListRef.insertAdjacentHTML('beforeend', markup);

    if (oneCountry) {
        markup = data
        .map(({ capital, population, languages }) => {
            return `<p><b>Capital:</b> ${capital}</p>
            <p><b>Population:</b> ${population}</p>        
            <p><b>Languages:</b> ${Object.values(languages).join(", ")}</p>`;
        })
        .join("");       
        countryInfoRef.insertAdjacentHTML('beforeend', markup);
    }
};