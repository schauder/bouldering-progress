
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = google.visualization.arrayToDataTable([
                                                         ['Day',  'yellow', 'green'],
                                                         ['2016-03-15', 9,  2],
                                                         ['2016-03-18', 10, 4],
                                                         ['2016-03-20', 10, 5],
                                                         ['2016-03-24', 10, 6],
                                                         ['style', 'color: yellow', 'color: green']
                                                     ]);

    var options = {
        title: 'Progress in Bouldering',
        vAxis: {title: 'Boulder Problems'},
        connectSteps: false,
        isStacked: true
    };

    var chart = new google.visualization.SteppedAreaChart(document.getElementById('chart_div'));

    chart.draw(data, options);
}