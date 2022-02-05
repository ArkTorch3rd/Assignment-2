/* 
 ** Get Last Update Date Activation
 */

const updateDate = document.querySelectorAll('.last-update-wrap');
if (updateDate) {
    updateDate.forEach((item, indx) => {
        getLastUpdatedTime(item, 'date')
    });
}

/* 
 ** Worldwide Statistics Activation
 */

const worldwide = document.querySelectorAll('.worldwide-stats');
if (worldwide) {
    worldwide.forEach((item, indx) => {
        worldwideReport(item)
    });
}

/* 
 ** Countrywise Statistics Activation
 */

const countrywise = document.getElementById('country-report');
if (countrywise) {
    countryReport(countrywise, 'BD');
}


/* 
 ** Statistics with Country Choose Dropdown Activation
 */

const countryChoose = document.querySelector('.country-choose-stats');
if (countryChoose) {
    reportWithDropdown(countryChoose, 'world');
}

/* 
 ** Map Statistics Report
 */

const mapWiseReport = document.getElementById('map-status-report');
if (mapWiseReport) {
    mapStatus(mapWiseReport);
}

/*
 ** Cases By Country List Activation
 */
const lists = document.querySelector('.cases-by-country')
if (lists) {
    casesByCountry();
}

/*
 ** Table List Report Activation
 */

const listTableReport = document.getElementById('list-view');
if (listTableReport) {
    reportListView(listTableReport, true);
}

/*
 **  Chart Report Activation
 */

const chartID = document.getElementById('chart-canvas');
if (chartID) {
    chartReport(chartID);
}

/*
 **  Worldwide Stats with Chart Activation
 */

worldwidrWithPieChart();

/*
 **  Map Report Activation
 */

const mapReports = document.querySelectorAll('.map-report');

if (mapReports) {
    mapReports.forEach((item, indx) => {
        mapReport(item, 'BD');
    })
}


/*
 **  Mini Chart Activation
 */

miniChart();