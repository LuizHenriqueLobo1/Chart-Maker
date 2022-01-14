const PROJECT = loadProject();
const CHARTS = ["Line", "Treemap", "Bubble", "Bar", "Sunburst"];
const DIV = document.querySelector("#chart");

window.onload = () => {
    let select = document.querySelector("#charts");
    CHARTS.forEach((chart) => {
        let option = document.createElement("option");
        option.textContent = chart;
        select.appendChild(option);
    });
    updateProject();
}

function loadProject() {
    let request = new XMLHttpRequest();
    request.open("GET", "./data.json", false);
    request.send();
    return JSON.parse(request.responseText);
}

function updateProject() {
    PROJECT.counties.forEach(countie => PROJECT.mesoregions[0].counties.push(countie));
    let countiesMicroregion1 = PROJECT.counties.slice(0, 5);
    PROJECT.microregions[0].counties = countiesMicroregion1;
    let countiesMicroregion2 = PROJECT.counties.slice(5, 8);
    PROJECT.microregions[1].counties = countiesMicroregion2;
}

function renderChart() {
    let selectedChart = document.querySelector("#charts").value;
    switch(selectedChart) {
        case "Line": {
            line();
            break;
        }
        case "Treemap": {
            treemap();
            break;
        }
        case "Bubble": {
            bubble();
            break;
        }
        case "Bar": {
            bar();
            break;
        }
        case "Sunburst": {
            sunburst();
            break;
        }
    }
}

const CONFIG = { responsive: true };
const LAYOUT = { title: "My Chart" };

const SELECTED_REGION  = PROJECT.counties[0];
const SELECTED_PERIODS = PROJECT.periods;

function line() {

    let trace = {
        x: SELECTED_PERIODS,
        y: SELECTED_REGION.attributes[1].values,
        type: 'scatter'
    }

    let data = [ trace ];

    Plotly.newPlot(DIV, data, LAYOUT, CONFIG);
}

function treemap() {

    let selectedRegions = [
        PROJECT.mesoregions[0], 
        PROJECT.microregions[1], 
        PROJECT.counties[0], 
        PROJECT.counties[5], 
        PROJECT.counties[6]
    ];

    let element = {
        type: "treemap",
        labels: selectedRegions.map(region => region.name),
        parents: [ PROJECT.state, selectedRegions[0].name, selectedRegions[0].name, selectedRegions[1].name, selectedRegions[1].name],
        values: selectedRegions.map(region => region.attributes[1].values[1]),
        textinfo: "label+value",
    };

    let data = [ element ];

    const textSelectedPeriod    = SELECTED_PERIODS[0];
    const textSelectedAttribute = "Dinheiro investido na Saúde";
    const textDescription       = `${textSelectedAttribute} - ${textSelectedPeriod}`;

    let layout = {
        title: "My Chart",
        annotations: [ {  text: textDescription, showarrow: false, y: 1, x: 1 } ]
    }

    Plotly.newPlot(DIV, data, layout, CONFIG);
}

function bubble() {

    let bubble = {
        x: SELECTED_PERIODS,
        y: SELECTED_REGION.attributes[0].values,
        mode: 'markers',
        marker: { size: SELECTED_REGION.attributes[0].values }
    };

    let data = [ bubble ];

    Plotly.newPlot(DIV, data, LAYOUT, CONFIG);
}

function bar() {

    let bar = {
        x: SELECTED_PERIODS,
        y: SELECTED_REGION.attributes[1].values,
        type: 'bar',
    };

    let data = [ bar ];

    Plotly.newPlot(DIV, data, LAYOUT, CONFIG);
}

function sunburst() {

    let selectedRegions = [
        PROJECT.mesoregions[0], 
        PROJECT.microregions[1], 
        PROJECT.counties[0], 
        PROJECT.counties[5], 
        PROJECT.counties[6]
    ];

    let element1 = {
        type: "sunburst",
        labels: selectedRegions.map(region => region.name),
        parents: [ PROJECT.state, selectedRegions[0].name, selectedRegions[0].name, selectedRegions[1].name, selectedRegions[1].name],
        values: selectedRegions.map(region => region.attributes[1].values[1]),
        outsidetextfont: {size: 20, color: "#377eb8"},
        leaf: {opacity: 0.4},
        marker: {line: {width: 2}}
    };

    let element2 = {
        type: "sunburst",
        labels: selectedRegions.map(region => region.name),
        parents: [ PROJECT.state, selectedRegions[0].name, selectedRegions[0].name, selectedRegions[1].name, selectedRegions[1].name],
        values: selectedRegions.map(region => region.attributes[1].values[1]),
        outsidetextfont: {size: 20, color: "#377eb8"},
        leaf: {opacity: 0.4},
        marker: {line: {width: 2}}
    };

    var data = [ element1, element2 ];
      
      var layout = {
        margin: {l: 0, r: 0, b: 0, t: 0},
      };
      
      Plotly.newPlot(DIV, data, layout, CONFIG);
}
