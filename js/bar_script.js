var models = [
    {
        "emotion": "Happy",
        "east_count": "8",
        "west_count": "1",
    },
    {
        "emotion": "Somewhat happy",
        "east_count": "13",
        "west_count": "19",
    },
    {
        "emotion": "Somewhat unhappy",
        "east_count": "27",
        "west_count": "82",
    },
    {
        "emotion": "Unhappy",
        "east_count": "93",
        "west_count": "147",
    }
];

models = models.map(i => {
    i.emotion = i.emotion;
    return i;
});

var legend_colors = [["Eastern", "ffbf69"],
["Western", "cbf3f0"]];

var container = d3.select('#d3id'),
    width = 700,
    height = 500,
    margin = { top: 200, right: 20, bottom: 10, left: 50 },
    barPadding = .2,
    axisTicks = { qty: 10, outerSize: 0, dateFormat: '%m-%d' };

var svg = container
    .append("svg")
    .attr("width", width + 200)
    .attr("height", height + 100)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

var tooltip = d3.select("body")
    .append("div").style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")


var xScale0 = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(barPadding);
var xScale1 = d3.scaleBand();
var yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

var xAxis = d3.axisBottom(xScale0).tickSizeOuter(axisTicks.outerSize);
var yAxis = d3.axisLeft(yScale).ticks(axisTicks.qty).tickSizeOuter(axisTicks.outerSize);

xScale0.domain(models.map(d => d.emotion));
xScale1.domain(['east_count', 'west_count']).range([0, xScale0.bandwidth()]);
yScale.domain([0, 160]);

var emotion = svg.selectAll(".emotion")
    .data(models)
    .enter().append("g")
    .attr("class", "emotion")
    .attr("transform", d => `translate(${xScale0(d.emotion)},0)`);

emotion.selectAll(".bar.east_count")
    .data(d => [d])
    .enter()
    .append("rect")
    .attr("class", "bar east_count")
    .style("fill", "ffbf69")
    .attr("x", d => xScale1('east_count'))
    .attr("y", d => yScale(d.east_count))
    .attr("width", xScale1.bandwidth())
    .on("mouseover", function (d) {
        d3.select(this).style("fill", "ff9f1c"); return tooltip.style("visibility", "visible").text(d.emotion + " " + d.east_count + ", From total: " + (parseFloat(d.east_count * 100 / 141).toFixed(1)) + "%");
    })
    .on("mousemove", function () {
        return tooltip.style("top",
            (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px").text(d.emotion + " " + d.east_count + ", From total: " + (parseFloat(d.east_count * 100 / 141).toFixed(1)) + "%");
    })
    .on("mouseout", function (d) {
        d3.select(this).style("fill", "ffbf69");
        return tooltip.style("visibility", "hidden");
    })
    .attr("height", d => {
        return height - margin.top - margin.bottom - yScale(d.east_count)
    });

emotion.selectAll(".bar.west_count")
    .data(d => [d])
    .enter()
    .append("rect")
    .attr("class", "bar west_count")
    .style("fill", "cbf3f0")
    .attr("x", d => xScale1('west_count'))
    .attr("y", d => yScale(d.west_count))
    .attr("width", xScale1.bandwidth())
    .on("mouseover", function (d) {
        d3.select(this).style("fill", "2ec4b6"); return tooltip.style("visibility", "visible").text(d.emotion + " " + d.west_count + ", From total: " + (parseFloat(d.west_count * 100 / 249).toFixed(1)) + "%");
    })
    .on("mousemove", function () {
        return tooltip.style("top",
            (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px").text(d.emotion + " " + d.west_count + ", From total: " + (parseFloat(d.west_count * 100 / 249).toFixed(1)) + "%");
    })
    .on("mouseout", function (d) {
        d3.select(this).style("fill", "cbf3f0");
        return tooltip.style("visibility", "hidden");
    })
    .attr("height", d => {
        return height - margin.top - margin.bottom - yScale(d.west_count)
    });

// Add the X Axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
    .call(xAxis);

// Add the Y Axis
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

svg.append("circle")
    .attr("cx", 620)
    .attr("cy", 0)
    .attr("r", 6)
    .style("fill", "ff9f1c")
// .attr("transform", `translate(0,${height})`);

svg.append("circle").attr("cx", 620).attr("cy", 30).attr("r", 6).style("fill", "2ec4b6")
svg.append("text").attr("x", 650).attr("y", 0).text("Eastern").style("font-size", "15px").attr("alignment-baseline", "middle")
svg.append("text").attr("x", 650).attr("y", 30).text("Western").style("font-size", "15px").attr("alignment-baseline", "middle")

