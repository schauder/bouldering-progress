
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(displayBoulderingData);

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