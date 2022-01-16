const PROJECT = loadProject();
const CHARTS = ["Line", "Bar", "Treemap", "Sunburst"];

window.onload = () => {
    loadSelectCharts();
    loadCustomSelect("attributes", PROJECT.attributes);
    loadCustomSelect("periods", PROJECT.periods);
    updateProject();
}

function loadSelectCharts() {
    let select = document.querySelector("#charts");
    CHARTS.forEach((chart) => {
        let option = document.createElement("option");
        option.textContent = chart;
        select.appendChild(option);
    });
}

function loadCustomSelect(id, array) {
    let select = document.querySelector(`#${id}`);
    select.style.display = "none";
    array.forEach((element, index) => {
        let div   = document.createElement("div");
        let check = document.createElement("input");
        let label = document.createElement("label");
        let check_id = `check-${index + 1}`;

        if(typeof element === "number") {
            label.textContent = element;
            check.setAttribute("value", element);
        } else {
            label.textContent = element.name;
            check.setAttribute("value", element.name);
        }

        check.setAttribute("type", "checkbox");
        check.setAttribute("id", `${check_id}`);
        label.setAttribute("for", `${check_id}`);
        div.classList = "option";

        div.appendChild(check);
        div.appendChild(label);
        select.appendChild(div);
    });
}

function getSelectedAttributes() {
    let selectedAttributes = [];
    for(let i = 0; i < PROJECT.attributes.length; i++) {
        let check = document.querySelector(`#check-${i + 1}`);
        if (check.checked) selectedAttributes.push(i);
    }
    return selectedAttributes;
}

function showCustomSelect(id) {
    if(id.includes("1")) {
        hideSomeone(document.querySelector("#attributes"));
    } else if(id.includes("2")) {
        hideSomeone(document.querySelector("#periods"));
    }
}

function hideSomeone(element) {
    if(element.style.display === "none") {
        element.style.display = "flex";
    } else {
        element.style.display = "none";
    }
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
    let attributes = getSelectedAttributes();
    let selectedChart = document.querySelector("#charts").value;
    switch(selectedChart) {
        case "Line": {
            line(attributes);
            break;
        }
        case "Bar": {
            bar(attributes);
            break;
        }
        case "Treemap": {
            treemap();
            break;
        }
        case "Sunburst": {
            sunburst();
            break;
        }
    }
}

const DIV    = document.querySelector("#chart");
const CONFIG = { responsive: true };

// Basics
function line(attributes) {

    let data = [];

    attributes.forEach((attribute) => {
        data.push({
            x: PROJECT.periods,
            y: PROJECT.counties[0].attributes[attribute].values,
            type: "scatter",
            name: PROJECT.attributes[attribute].name
        });
    });

    let layout = {
        title: "Cachoeira",
        showlegend: true,
        legend: { "orientation": "h" }
    };

    Plotly.newPlot(DIV, data, layout, CONFIG);
}

function bar(attributes) {

    let data = [];

    attributes.forEach((attribute) => {
        data.push({
            x: PROJECT.periods,
            y: PROJECT.counties[0].attributes[attribute].values,
            type: "bar",
            name: PROJECT.attributes[attribute].name
        });
    });

    let layout = {
        title: "Cachoeira",
        showlegend: true,
        legend: { "orientation": "h" }
    };

    Plotly.newPlot(DIV, data, layout, CONFIG);
}

// Hierarchical
function treemap() {

    let element = {
        type: "treemap",
        labels: ["Bahia", "Acre", "Rio Branco", "Salvador", "Manaus"],
        parents: [ "", "", "Acre", "Bahia", "" ],
        values: [22, 8, 1, 10, 4],
        textinfo: "label+value",
    };

    let data = [ element ];

    let layout = {
        annotations: [ {  text: "Milhões Investidos em Saúde - 2005", showarrow: false, y: 1, x: 1 } ]
    }

    Plotly.newPlot(DIV, data, layout, CONFIG);
}

function sunburst() {

    let element = {
        type: "sunburst",
        labels: ["Bahia", "Acre", "Rio Branco", "Salvador", "Manaus"],
        parents: [ "", "", "Acre", "Bahia", "" ],
        values: [22, 8, 1, 10, 4],
        outsidetextfont: {size: 20, color: "#377eb8"},
        leaf: {opacity: 0.4},
        marker: {line: {width: 2}}
    };

    let data = [ element ];
    
    let layout = {
        annotations: [ {  text: "Milhões Investidos em Saúde - 2005", showarrow: false, y: 1, x: 1 } ],
        margin: {l: 0, r: 0, b: 20, t: 20},
    }

    Plotly.newPlot(DIV, data, layout, CONFIG);
}
