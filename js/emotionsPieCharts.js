const emotions = ["Happy", "Somewhat Happy", "Somewhat Unhappy", "Unhappy"];
var legendRectSize = 30;
var legendSpacing = 4;

var probabilities = {};

document.getElementById("perhour").click();

function EmotionTimesPerHour() {
    d3.json('../json/EmotionTimesCheckPhonePerHour.json', function (data) {
        var total = 0;
        probabilities = {
            1: 0,
            2: 0,
            3: 0,
            4: 0
        };

        for (var key of Object.keys(data.EmotionTimesCheckPhonePerHour)) {
            total += 1;
            for (var key_prob in probabilities) {
                if (data.EmotionTimesCheckPhonePerHour[key] == key_prob) {
                    probabilities[key_prob] += 1;
                }
            }
        }

        for (var key_prob in probabilities) {
            probabilities[key_prob] = (probabilities[key_prob] / total) * 100;
        }

        update(probabilities);


    });
}


function EmotionTimesPerDay() {
    d3.json('../json/EmotionTimeUsePhonePerDay.json', function (data) {

        var total = 0;
        probabilities = {
            1: 0,
            2: 0,
            3: 0,
            4: 0
        };
        for (var key of Object.keys(data.EmotionTimeUsePhonePerDay)) {
            total += 1;
            for (var key_prob in probabilities) {
                if (data.EmotionTimeUsePhonePerDay[key] == key_prob) {
                    probabilities[key_prob] += 1;
                }
            }
        }
        for (var key_prob in probabilities) {
            probabilities[key_prob] = (probabilities[key_prob] / total) * 100;
        }

        update(probabilities);
    });
}

var width = 700;
height = 450
margin = 40

var radius = Math.min(width, height) / 2 - margin

var svg = d3.select("#emotiontimes")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


var color = d3.scaleOrdinal()
    .range(d3.schemeSet3);




function update(data) {
    var pie = d3.pie()
        .value(function (d) {
            return d.value;
        })
        .sort(function (a, b) {
            return d3.ascending(a.key, b.key);
        })
    var data_ready = pie(d3.entries(data));

    var tooltip = d3.select('#emotiontimes')
        .append('div')
        .attr('class', 'tooltipPieCharts');

    tooltip.append('div')
        .attr('class', 'label');

    tooltip.append('div')
        .attr('class', 'count');

    tooltip.append('div')
        .attr('class', 'percent');

    var u = svg.selectAll("path")
        .data(data_ready);

    u.enter()
        .append('path').on('mouseover', function (d) {
            tooltip.select('.label').html(emotions[d.data.key - 1]);
            tooltip.select('.percent').html(d.data.value.toFixed(2) + '%');
            tooltip.style('display', 'block');
        })
        .on('mouseout', function () {
            tooltip.style('display', 'none');
        })
        .on('mousemove', function (d) {
            tooltip.style('top', (d3.event.layerY + 10) + 'px')
                .style('left', (d3.event.layerX + 10) + 'px');
        })
        .merge(u)
        .transition()
        .duration(1000)
        .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        )
        .attr('fill', function (d) {
            return (color(d.data.key))
        })
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 1);


    var legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legendPieCharts')
        .attr('transform', function (d, i) {
            var height = legendRectSize + legendSpacing;
            var offset = height * color.domain().length / 2;
            var horz = 200;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr("class", "rectPieCharts")
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .attr('padding', '200px')
        .style('fill', color)
        .style('stroke', color);

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function (d) {
            return emotions[d - 1];
        });

    u
        .exit()
        .remove()

}