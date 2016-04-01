(function () {
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

    /**
     * extracts the colors used in the data
     * @param originalData
     * @returns {Array.<String>}
     */
    function extractColors(originalData) {
        var colorsPlusDay = Object.keys(originalData[originalData.length - 1]);
        return colorsPlusDay.filter(function (color) {
            return color != "day"
        });
    }

    /**
     * Computes for each color how it should be scaled.
     *
     * Scaling happens so that the total that the max value is
     *
     * (maximum positive number + abs(minimum(negative number)))
     *
     * @param originalData
     * @param colors
     * @returns {{}}
     */
    function computeScaling(originalData, colors) {
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
        return scaling;
    }

    /**
     * translates a value for a given color to it's correctly scaled value.
     *
     * Positive numbers don't get scaled at all. Negative numbers (including -0) get added to a
     * maximum value obtained from the scaling
     *
     * @param scaling defining how the values for different colors should be scaled
     * @param color the color value (a string)
     * @param value the value to be scaled.
     * @returns {*}
     */
    function translate(scaling, color, value) {
        if (value < 0 || isNegativeZero(value)) {
            return scaling[color] + value;
        } else {
            return value;
        }
    }

    /**
     * transforms the data as retrieved via ajax into the row format required by google charts
     * @param originalData data in the format used in data.json
     * @param colors an array of the color values used (strings)
 * @returns {Array} of rows as required by google charts
     */
    function transform(originalData, colors) {
        var scaling = computeScaling(originalData, colors);

        return originalData.map(function (inputRow) {
            var data = [
                inputRow.day
            ];

            colors.forEach(function (color) {
                data.push(
                    translate(scaling, color, inputRow[color]),
                    'color: ' + color + '; stroke-width: 0'
                )
            });

            return data;
        });
    }

    /**
     * creates a diagram using google charts from the rows provided as parameter
     *
     * @param colors an array of the color values used (strings)
     * @param rows an array of rows as expected by google charts
     */
    function createDiagram(colors, rows) {
        var data = new google.visualization.DataTable();

        data.addColumn('string', 'Day');
        colors.forEach(function (color) {
            data.addColumn('number', color);
            data.addColumn({type: 'string', role: 'style'});
        });

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

    /**
     * loads the data using ajax, transforms it and displays it usign google charts
     */
    function displayBoulderingData() {

        loadData(
            function (data) {
                var colors = extractColors(data);
                createDiagram(colors, transform(data, colors));
            }
        );
    }

    google.charts.load('current', {'packages': ['corechart']});
    google.charts.setOnLoadCallback(displayBoulderingData);

})();

