export function fetchCountries(name) {
    const searchCountryParams = new URLSearchParams({
    fields: 'name,capital,population,flags,languages'
    });
    
    return fetch(`https://restcountries.com/v3.1/name/${name}?${searchCountryParams}`).then((response) => {
        if (!response.ok) {
            throw new Error(response.status)
        }
        return response.json()
    }
    );
};