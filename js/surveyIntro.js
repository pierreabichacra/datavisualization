var legendRectSize = 18;
var legendSpacing = 4;

const width = 540;
const height = 540;
const radius = Math.min(width, height) / 2;

const svg = d3.select("#donut-chart-area")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

const color = d3.scaleOrdinal(["#66c2a5", "#fc8d62", "#8da0cb",
    "#e78ac3", "#a6d854", "#ffd92f"]);

const pie = d3.pie()
    .value(d => d.count)
    .sort(null);

const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

d3.json("json/genderProcessed.json", function (data) {

    d3.selectAll("input")
        .on("change", update);

    function update(val = this.value) {
        svg.selectAll(".legend").remove();

        d3.selectAll("path").remove()
        svg.selectAll("text").remove()
        const path = svg.selectAll("path")
            .data(pie(data[val]));

        var tooltip = d3.select('#donut-chart-area')
            .append('div')
            .attr('class', 'tooltipSurveyIntro');

        tooltip.append('div')
            .attr('class', 'label');

        tooltip.append('div')
            .attr('class', 'count');

        tooltip.append('div')
            .attr('class', 'percent');

        path.enter().append("path")
            .attr("fill", (d, i) => color(i))
            .attr("d", arc)
            .attr("stroke", "white")
            .attr("stroke-width", "10px")
            .attr('d', d3.arc()
                .innerRadius(170)
                .outerRadius(radius))
            .each(function (d) { this._current = d; })
            .on('mouseover', function (d) {
                tooltip.select('.label').html(val + ": " + d.data.value);
                tooltip.select('.percent').html(d.data.count + '% <br>People Surveyed: ' + d.data.numberOfValues);
                tooltip.style('display', 'block');
            })
            .on('mouseout', function () {
                tooltip.style('display', 'none');
            })
            .on('mousemove', function (d) {
                tooltip.style('top', (d3.event.layerY + 10) + 'px')
                    .style('left', (d3.event.layerX + 150) + 'px');
            });

        svg.append('text')
            .attr('class', 'toolCircle')
            .attr('dy', -70) 
            .html(val)
            .style('font-size', '2em')
            .style('text-anchor', 'middle');

        var legendG = svg.selectAll(".legend")
            .data(pie(data[val]), function (d) {
                return data[val][d];
            })
        var legendEnter = legendG
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function (d, i) {
                var height = legendRectSize + legendSpacing;
                var offset = height * color.domain().length / 2;
                var horz = -2 * legendRectSize;
                var vert = i * height - offset;
                return 'translate(' + horz + ',' + (vert + 30) + ')';
            });

        legendG.exit().remove();

        legendEnter.append("rect")
        .attr("class", "surveyIntroRect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", function (d, i) {
                return color(i);
            });

        legendEnter.append("text")
            .text(function (d) {
                return d.data.value;
            })
            .style("font-size", 12)
            .attr("y", 10)
            .attr("x", 11);

    }

    update("Gender");
});