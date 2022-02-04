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
/**
 * Function for Insert DATA to DOM
 * @param selectorID
 * @param data
 * @param yesterdayData
 */

 const insertData = (selectorID, data, yesterdayData) => {
    const totalInfected = selectorID.querySelectorAll('.infected');
    const totalDeaths = selectorID.querySelectorAll('.deaths');
    const totalRecovered = selectorID.querySelectorAll('.recovered');
    const todayInfected = selectorID.querySelectorAll('.today_infected');
    const todayDeaths = selectorID.querySelectorAll('.today_deaths');
    const todayRecovers = selectorID.querySelectorAll('.today_recovered');
    const todayActiveCases = selectorID.querySelectorAll('.today_active_cases');
    const currentCases = selectorID.querySelectorAll('.current_cases');
    const deathsRate = selectorID.querySelectorAll('.deaths-rate');
    const recoverRate = selectorID.querySelectorAll('.recover-rate');

    const dataToDOM = (selectors, value) => {
        selectors.forEach((item, index) => {
            item.innerHTML = value.toLocaleString();
        });
    }

    const deathRate = (data.deaths * 100) / data.cases;
    const recoveredRate = (data.recovered * 100) / data.cases;
    const todayRecovered = (data.recovered - yesterdayData.recovered);
    const todayActiveCased = (data.active - yesterdayData.active);

    dataToDOM(totalInfected, data.cases);
    dataToDOM(totalDeaths, data.deaths);
    dataToDOM(totalRecovered, data.recovered);
    dataToDOM(todayInfected, data.todayCases);
    dataToDOM(todayDeaths, data.todayDeaths);
    dataToDOM(todayRecovers, todayRecovered <= 0 ? '0,000' : todayRecovered);
    dataToDOM(todayActiveCases, todayActiveCased <= 0 ? '0,000' : todayActiveCased);
    dataToDOM(currentCases, data.active);
    dataToDOM(deathsRate, deathRate.toFixed(2));
    dataToDOM(recoverRate, recoveredRate.toFixed(2));
    getLastUpdatedTime(selectorID, 'minute');
}

/**
 * Function For Report with Dropdown Selector
 * @param selectorID
 * @param specificCountry
 * @returns {Promise<void>}
 */
const reportWithDropdown = async (selectorID, specificCountry) => {
    let findThisSelect = selectorID.querySelector('select[name=country]');
    await makeSelectOption(findThisSelect, specificCountry);
    let data, yesterdayData;
    data = await getData(BASE_URL + `v2/${findThisSelect.value || 'all'}`);
    yesterdayData = await getData(BASE_URL + `v2/${findThisSelect.value || 'all'}?yesterday=true`);

    insertData(selectorID, data, yesterdayData);

    jQuery(findThisSelect).on('change', async (e) => {
        data = await getData(BASE_URL + `v2/${e.target.value}`);
        yesterdayData = await getData(BASE_URL + `v2/${e.target.value}?yesterday=true`);
        insertData(selectorID, data, yesterdayData);
    });
};

/**
 * Function for Country Report
 * @param selectID
 * @param countryName
 * @returns {Promise<void>}
 */
const countryReport = async (selectID, countryName) => {
    let countryData = await getData(BASE_URL + `v2/countries/${countryName}`);
    let yesterdayCountryData = await getData(BASE_URL + `v2/countries/${countryName}?yesterday=true`);
    insertData(selectID, countryData, yesterdayCountryData);
};

/**
 * Function for Cases by Country
 * @returns {Promise<void>}
 */

const casesByCountry = async () => {
    const data = await getData(BASE_URL + 'v2/countries');
    let noListsShow = 11;
    const countryLists = document.querySelector('.cases-country-lists');
    const btnShowAll = document.querySelector('.btn-show-all');
    const btnCollapse = document.querySelector('.btn-collapse');

    const casesByCountriesData = (data) => {
        const countryItem = document.createElement('li');
        const countryName = document.createElement('h6');
        const infectedNo = document.createElement('span');

        countryName.classList.add('country-name');
        infectedNo.className = 'cases-no infected';
        countryName.innerHTML = data.country;
        infectedNo.innerHTML = data.cases;

        countryItem.appendChild(countryName);
        countryItem.appendChild(infectedNo);
        countryLists.appendChild(countryItem);
    }

    data.map(country => {
        casesByCountriesData(country);
    });

    btnShowAll.addEventListener('click', () => {
        noListsShow = -1;
        countryLists.innerHTML = '';
        data.slice(0, noListsShow).map(country => {
            casesByCountriesData(country);
        })
        btnShowAll.style.display = 'none';
        btnCollapse.style.display = 'inline-block';
    })

    btnCollapse.addEventListener('click', () => {
        noListsShow = 11;
        countryLists.innerHTML = '';
        data.slice(0, noListsShow).map(country => {
            casesByCountriesData(country);
        })
        btnCollapse.style.display = 'none';
        btnShowAll.style.display = 'inline-block';
    })
}

/**
 * Function for Worldwide Report
 * @param selectID
 * @returns {Promise<void>}
 */

const worldwideReport = async (selectID) => {
    let worldwideData = await getData(BASE_URL + 'v2/all');
    let yesterdayWorldwideData = await getData(BASE_URL + 'v2/all?yesterday=true');
    insertData(selectID, worldwideData, yesterdayWorldwideData);
};

/**
 * Function for List view Data
 * @returns {Promise<void>}
 */

const reportListView = async (selectorID, search) => {
    const listData = await getData(BASE_URL + 'v2/countries');

    function createListTableColumn(data, appendParent) {
        const td = document.createElement('td');
        td.innerHTML = data;
        appendParent.appendChild(td);
    }

    function countryNameWithFlag(name, flag, appendParent) {
        const td = document.createElement('td');
        const img = document.createElement('img');
        img.src = flag;
        img.alt = name;
        td.appendChild(img);
        td.innerHTML = td.innerHTML + name;
        appendParent.appendChild(td);
    }

    async function dataRow(data, world) {
        let listTable = selectorID.querySelector('.list-view__body');
        const deathRate = (data.deaths * 100) / data.cases;
        const recoveredRate = (data.recovered * 100) / data.cases;
        const tr = document.createElement('tr');
        tr.className = world ? 'worldwide-item' : 'country-item';
        countryNameWithFlag(data.country, data.countryInfo.flag, tr);
        createListTableColumn(data.cases, tr);
        createListTableColumn(`+${data.todayCases}`, tr);
        createListTableColumn(data.deaths, tr);
        createListTableColumn(`${deathRate.toFixed(2)}%`, tr);
        createListTableColumn(`+${data.todayDeaths}`, tr);
        createListTableColumn(data.recovered, tr);
        createListTableColumn(`${recoveredRate.toFixed(2)}%`, tr);
        createListTableColumn(data.active, tr);
        listTable.appendChild(tr);
    }

    listData.map(async (countryData) => {
        await dataRow(countryData, false);
    });

    let table = selectorID.querySelector('table');

    jQuery(table).DataTable({
        "searching": !!search
    });
}