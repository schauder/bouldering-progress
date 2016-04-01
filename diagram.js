google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(displayBoulderingData);

function isNegativeZero(n) {
    n = Number(n);
    return (n === 0) && (1 / n === -Infinity);
}

/**
 * loads the data and passes it (parsed from json) to the function given as a parameter
 *
 * @param dataProcessor the function that will get called, with the data
 */
function loadData(dataProcessor) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            dataProcessor(JSON.parse(xhttp.responseText));
        }
    };
    xhttp.open("GET", "data.json", true);
    xhttp.send();
}

function extractColors(originalData) {
    var colorsPlusDay = Object.keys(originalData[originalData.length - 1]);
    return colorsPlusDay.filter(function(color){return color != "day"});
}
/**
 * transforms the data as retrieved via ajax into the row format required by google charts
 * @param originalData data in the format used in data.json
 * @returns {Array} of rows as required by google charts
 */
function transform(originalData) {
    var colors = extractColors(originalData);
    console.log(colors);
    var scaling = {};
    colors.forEach(function (color) {
        var min = originalData.reduce(function (previous, row) {
            return Math.min(previous, row[color])
        }, 0);
        console.log(min);

        var max = null;
        if (min < 0) {
            max = 1 + originalData.reduce(function (previous, row) {
                    return Math.max(previous, row[color])
                }, 0) - min;
        }
        scaling[color] = max;
    });

    console.log(scaling);

    function translate(color, value) {
        if (value < 0 || isNegativeZero(value)) {
            return scaling[color] + value;
        } else {
            return value;
        }
    }

    return originalData.map(function (inputRow) {
        return [
            inputRow.day,
            translate("yellow", inputRow.yellow), 'color: yellow; stroke-width: 0',
            translate("green", inputRow.green), 'color: green; stroke-width: 0'
        ];
    });
}

/**
 * creates a diagram using google charts from the rows provided as parameter
 *
 * @param rows an array of rows as expected by google charts
 */
function createDiagram(rows) {
    var data = new google.visualization.DataTable();

    data.addColumn('string', 'Day');
    data.addColumn('number', 'Yellow');
    data.addColumn({type: 'string', role: 'style'});
    data.addColumn('number', 'Green');
    data.addColumn({type: 'string', role: 'style'});
    data.addRows(rows);

    var options = {
        title: 'Progress in Bouldering',
        vAxis: {title: 'Boulder Problems'},
        connectSteps: false,
        isStacked: false
    };

    var chart = new google.visualization.SteppedAreaChart(document.getElementById('chart_div'));

    chart.draw(data, options);
}

function displayBoulderingData() {

    loadData(
        function (data) {
            createDiagram(transform(data));
        }
    );
}