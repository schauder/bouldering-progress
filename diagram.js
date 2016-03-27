
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(displayBoulderingData);

function loadData() {
    return [{
        "day": "2016-03-18",
        "yellow": -3,
        "green": 4
    },{
        "day": "2016-03-20",
        "yellow": -2,
        "green": 5
    },{
        "day": "2016-03-24",
        "yellow": -1,
        "green": 7
    },{
        "day": "2016-03-26",
        "yellow": -0,
        "green": 7
    }
    ];
    /*
    [
        ['2016-03-15',  9, 'color: yellow; stroke-width: 0', 2, 'color: green; stroke-width: 0'],
        ['2016-03-18', 10, 'color: yellow; stroke-width: 0', 4, 'color: green; stroke-width: 0'],
        ['2016-03-20', 10, 'color: yellow; stroke-width: 0', 5, 'color: green; stroke-width: 0'],
        ['2016-03-24', 10, 'color: yellow; stroke-width: 0', 6, 'color: green; stroke-width: 0']
    ]
    */
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

    var originalData = loadData();
    var dataInGoogleFormat = transform(originalData);
    createDiagram(dataInGoogleFormat);

}