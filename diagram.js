
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = new google.visualization.DataTable();
    //['Day',  'yellow', 'green'],
    data.addColumn('string', 'Day');
    data.addColumn('number', 'Yellow');
    data.addColumn({type: 'string', role: 'style'})
    data.addColumn('number', 'Green');
    data.addColumn({type: 'string', role: 'style'})
    data.addRows([
                     ['2016-03-15',  9, 'color: yellow; stroke-width: 0', 2, 'color: green; stroke-width: 0'],
                     ['2016-03-18', 10, 'color: yellow; stroke-width: 0', 4, 'color: green; stroke-width: 0'],
                     ['2016-03-20', 10, 'color: yellow; stroke-width: 0', 5, 'color: green; stroke-width: 0'],
                     ['2016-03-24', 10, 'color: yellow; stroke-width: 0', 6, 'color: green; stroke-width: 0']
    ]);


    var options = {
        title: 'Progress in Bouldering',
        vAxis: {title: 'Boulder Problems'},
        connectSteps: false,
        isStacked: false
    };

    var chart = new google.visualization.SteppedAreaChart(document.getElementById('chart_div'));

    chart.draw(data, options);
}