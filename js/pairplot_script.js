
var marginWhole = { top: 10, right: 10, bottom: 10, left: 10 },
  sizeWhole = 640 - marginWhole.left - marginWhole.right

var svg = d3.select("#d3id")
  .append("svg")
  .attr("width", sizeWhole + marginWhole.left + marginWhole.right)
  .attr("height", sizeWhole + marginWhole.top + marginWhole.bottom)
  .append("g")
  .attr("transform", "translate(" + marginWhole.left + "," + marginWhole.top + ")");

d3.csv("csv/FeaturesCorrelation.csv", function (data) {
  console.log(data);
  var allVar = ["Education", "Employment", "Age", "Sleep", "MinsSmartphone"]
  var numVar = allVar.length

  mar = 20
  size = sizeWhole / numVar

  var position = d3.scalePoint()
    .domain(allVar)
    .range([0, sizeWhole - size])

  for (i in allVar) {
    for (j in allVar) {

      var var1 = allVar[i]
      var var2 = allVar[j]

      if (var1 === var2) { continue; }

      xextent = d3.extent(data, function (d) { return +d[var1] })
      var x = d3.scaleLinear()
        .domain(xextent).nice()
        .range([0, size - 2 * mar]);

      yextent = d3.extent(data, function (d) { return +d[var2] })
      var y = d3.scaleLinear()
        .domain(yextent).nice()
        .range([size - 2 * mar, 0]);

      var tmp = svg
        .append('g')
        .attr("transform", "translate(" + (position(var1) + mar) + "," + (position(var2) + mar) + ")");

      tmp.append("g")
        .attr("transform", "translate(" + 0 + "," + (size - mar * 2) + ")")
        .call(d3.axisBottom(x).ticks(3));
      tmp.append("g")
        .call(d3.axisLeft(y).ticks(3));

      tmp
        .selectAll("myCircles")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(+d[var1]) })
        .attr("cy", function (d) { return y(+d[var2]) })
        .attr("r", 3)
        .attr("fill", "#4ea8de")
    }
  }


  for (i in allVar) {
    for (j in allVar) {
      if (i != j) { continue; }
      var var1 = allVar[i]
      var var2 = allVar[j]
      svg
        .append('g')
        .attr("transform", "translate(" + position(var1) + "," + position(var2) + ")")
        .append('text')
        .attr("x", size / 2)
        .attr("y", size / 2)
        .text(var1)
        .attr("text-anchor", "middle")

    }
  }


})