// API BASE URL
const BASE_URL = "https://corona.lmao.ninja/";

/**
 *  Function for Fetch Data
 * @param url
 * @returns {Promise<any>}
 */
async function getData(url) {
    let response = await fetch(url);
    return await response.json();
}

/**
 * Function for Generate Select Menu Option
 * @param select
 * @param selectedCountry
 * @returns {Promise<void>}
 */
const makeSelectOption = async (select, selectedCountry) => {
    let countries = await getData(BASE_URL + 'v2/countries/');
    let wwOptionDom = document.createElement('option');
    let location = window.location.href.split('/');
    const path = location.pop();
    wwOptionDom.value = 'all';
    wwOptionDom.innerHTML = 'Worldwide';
    wwOptionDom.dataset.image = location.join('/') + '/assets/img/global.png';
    wwOptionDom.selected = true;
    select.insertBefore(wwOptionDom, select.childNodes[0]);

    countries.map((country) => {
        let optionDom = document.createElement('option');
        optionDom.value = `countries/${country.countryInfo.iso2}`;
        optionDom.classList.add(country.countryInfo.iso2);
        if (country.countryInfo.iso2 === selectedCountry || country.countryInfo.iso3 === selectedCountry || country.country.toLocaleLowerCase() === selectedCountry) {
            wwOptionDom.selected = false;
            optionDom.selected = true;
        }
        optionDom.dataset.image = country.countryInfo.flag;

        optionDom.text = country.country;
        select.append(optionDom);
    });


    function formatState(opt) {
        if (!opt.id) {
            return opt.text;
        }

        let optimage = jQuery(opt.element).attr('data-image');
        if (!optimage) {
            return opt.text;
        } else {
            let $opt = jQuery(
                `<span><img src=${optimage} class='img-flag' />${opt.text}</span>`
            );
            return $opt;
        }
    };

    jQuery(select).select2({
        templateSelection: formatState,
        templateResult: formatState
    });
};


/**
 * Function for get last updated time
 * @param format
 * @param selectorID
 */
const getLastUpdatedTime = async (selectorID, format) => {
    const data = await getData(BASE_URL + `v2/all`);
    const diff_time = (dt2, dt1) => {
        let diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= (60);
        return Math.abs(Math.round(diff));
    };

    const lastUpdate = selectorID.querySelectorAll('.last-update');
    lastUpdate.forEach((item, index) => {
        const dt1 = new Date();
        const dt2 = new Date(data.updated);
        if (format === 'date') {
            item.innerHTML = dt2.toLocaleDateString() + " at " + dt2.toLocaleTimeString();
        } else {
            item.innerHTML = diff_time(dt2, dt1);
        }
    });
}