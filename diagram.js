
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(displayBoulderingData);

function loadData() {
    return [
        ['2016-03-15',  9, 'color: yellow; stroke-width: 0', 2, 'color: green; stroke-width: 0'],
        ['2016-03-18', 10, 'color: yellow; stroke-width: 0', 4, 'color: green; stroke-width: 0'],
        ['2016-03-20', 10, 'color: yellow; stroke-width: 0', 5, 'color: green; stroke-width: 0'],
        ['2016-03-24', 10, 'color: yellow; stroke-width: 0', 6, 'color: green; stroke-width: 0']
    ]
}


function transform(originalData) {
    return originalData;
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

    var originalData = loadData();
    var dataInGoogleFormat = transform(originalData);
    createDiagram(dataInGoogleFormat);

}