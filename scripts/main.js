const PROJECT = loadProject();
const CHARTS = ["Line", "Bar", "Treemap", "Sunburst"];

window.onload = () => {
    loadSelectCharts();
    loadSelectAttributes();
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

function loadSelectAttributes() {
    let select = document.querySelector("#attributes");
    select.style.display = "none";
    PROJECT.attributes.forEach((attribute, index) => {
        let div   = document.createElement("div");
        let check = document.createElement("input");
        let label = document.createElement("label");

        let check_id = `check-${index + 1}`;

        label.textContent = attribute.name;
        check.setAttribute("type", "checkbox");
        check.setAttribute("value", attribute.name);
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
        if (check.checked) selectedAttributes.push(check.value);
    }
    return selectedAttributes;
}

document.querySelector("#hider").addEventListener("click", () => {
    let button = document.querySelector("#hider");
    let select = document.querySelector("#attributes");
    if(select.style.display === "none") {
        select.style.display = "flex";
        button.textContent = "Hide";
    } else {
        select.style.display = "none";
        button.textContent = "Show";
    }
});

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
    let selectedAttributes = getSelectedAttributes();
    let selectedChart = document.querySelector("#charts").value;
    switch(selectedChart) {
        case "Line": {
            line();
            break;
        }
        case "Bar": {
            bar();
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
function line() {

    let trace = {
        x: [2001, 2002, 2003, 2004, 2005],
        y: [3928, 8453, 1425, 2356, 5234],
        type: "scatter",
        name: "Casos de Diabetes"
    }

    let data = [ trace ];

    let layout = {
        title: "Cachoeira",
        showlegend: true,
        legend: { "orientation": "h" }
    };

    Plotly.newPlot(DIV, data, layout, CONFIG);
}

function bar() {

    let bar = {
        x: [2001, 2002, 2003, 2004, 2005],
        y: [3928, 8453, 1425, 2356, 5234],
        type: "bar",
        name: "Casos de Diabetes"
    }

    let data = [ bar ];

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
