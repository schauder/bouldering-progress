
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(displayBoulderingData);

/**
 * loads the data and passes it (parsed from json) to the function given as a parameter
 *
 * @param dataProcessor the function that will get called, with the data
 */
function loadData(dataProcessor) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            dataProcessor( JSON.parse(xhttp.responseText));
        }
    };
    xhttp.open("GET", "data.json", true);
    xhttp.send();
}

/**
 * transforms the data as retrieved via ajax into the row format required by google charts
 * @param originalData data in the format used in data.json
 * @returns {Array} of rows as required by google charts
 */
function transform(originalData) {
    var rows = [];
    for (var i = 0; i < originalData.length; i++) {
        var inputRow = originalData[i];
        var row = [
            inputRow.day,
            inputRow.yellow, 'color: yellow; stroke-width: 0',
            inputRow.green, 'color: green; stroke-width: 0'
        ];
        rows.push(row);
    }

    return rows;
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
        function(data) {
            createDiagram(transform(data));
        }
    );
}