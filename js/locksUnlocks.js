var margin = {
    top: 20,
    right: 210,
    bottom: 50,
    left: 70
},
    outerWidth = 1800,
    outerHeight = 500,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

var legendRectSize = 18;                                  // NEW
var legendSpacing = 4;                                    // NEW

d3.json("../json/locksUnlocksProcessing.json", function (data) {

    var lock_dict = [];
    var lock_dict2 = [];
    var unlock_dict = [];
    var allDates = [];
    var allCounts = [];

    function gethighestVal_locks() {
        maxVal_lock = 0;
        maxVal_unlock = 0;
        index_lock = 0;
        index_unlock = 0;
        for (var i in data["lock"]) {
            if (data["lock"][i].NumberOfUsage > maxVal_lock) {
                maxVal_lock = data["lock"][i].NumberOfUsage;
                index_lock = i;

            }
        }
        for (var i in data["unlock"]) {
            if (data["unlock"][i].NumberOfUsage > maxVal_unlock) {

                maxVal_unlock = data["unlock"][i].NumberOfUsage;
                index_unlock = i;

            }
        }
    }


    for (var i = 0; i < 35; i++) {
        gethighestVal_locks();
        lock_dict.push({
            "Dates": data["lock"][index_lock].Dates,
            "NumberOfUsages": maxVal_lock,
            "NumberOfUsers": data["lock"][index_lock].NumberOfUsers
        });

        allCounts.push(parseInt(data["lock"][index_lock].NumberOfUsage))
        data["lock"][index_lock].NumberOfUsage = 0
        allDates.push(data["lock"][index_lock].Dates)


        unlock_dict.push({
            "Dates": data["unlock"][index_unlock].Dates,
            "NumberOfUsages": maxVal_unlock,
            "NumberOfUsers": data["unlock"][index_unlock].NumberOfUsers
        })

        allCounts.push(parseInt(data["unlock"][index_unlock].NumberOfUsage))
        data["unlock"][index_unlock].NumberOfUsage = 0
        allDates.push(data["unlock"][index_unlock].Dates)


    }

    var unique = allDates.filter(onlyUnique);

    unique.sort(function (a, b) {
        a = a.split('/');
        b = b.split('/');
        return a[1] - b[1] || a[0] - b[0];
    });

    allCounts.sort(function (a, b) {
        return a - b;
    });

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }


    var x = d3.scaleBand()
        .rangeRound([0, width]).padding(0.1);

    var y = d3.scaleLinear()
        .range([height, 0]);

    y.domain([1000, allCounts[allCounts.length - 1]]);
    x.domain(unique.map(function (d) { return d; }));

    var color = d3.scale.category10();

    var tip = d3.select('body').append("div")
        .attr("class", "locksUnlocksCircleTip");


    var svg = d3.select("#scatterLocksUnlocks")
        .append("svg")
        .attr("width", outerWidth)
        .attr("height", outerHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("rect")
        .attr("class", "rectLocksUnlocks")
        .attr("width", width)
        .attr("height", height);


    svg.append("g")
        .classed("x axis", true)
        .style("font-size", "12px")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));


    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("Date");


    svg.append("g")
        .classed("y axis", true)
        .style("font-size", "12px")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -5)
        .text("Usage");


    var objects = svg.append("svg")
        .classed("objects", true)
        .attr("width", width)
        .attr("height", height);
    objects.append("svg:line")
        .classed("axisLine hAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", width)
        .attr("y2", 0)
        .attr("transform", "translate(0," + height + ")");

    objects.append("svg:line")
        .classed("axisLine vAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", height);

    var locks = svg.append('g').selectAll("dot")
        .data(lock_dict)
        .enter()

    locks.append("circle")
        .attr("class", "locksUnlocksCircle")
        .attr("r", 6)
        .attr("cx", function (d) {
            return x(d.Dates);
        })
        .attr("cy", function (d) {
            return y(d.NumberOfUsages);
        })
        .attr("fill", "brown")
        .on("mouseover", function () {
            tip.style("display", null);
        })
        .on("mouseout", function () {
            tip.style("display", "none");
        })
        .on("mousemove", function (d) {
            return tip
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + 10 + "px")
                .style("visibility", "visible")
                .html(function () {
                    return '<div style = "font-size: smaller"><b>Locks</b>' +
                        '<p>Date: ' + d.Dates + '</p><p>Usages: ' + d.NumberOfUsages +
                        "</p><p>Number of Users: " + d.NumberOfUsers
                    '</div>';
                })
        });

    var unlocks = svg.append('g').selectAll("dot")
        .data(unlock_dict)
        .enter();


    unlocks.append("circle")
        .attr("class", "locksUnlocksCircle")
        .attr("r", 6)
        .attr("cx", function (d) {
            return x(d.Dates);
        })
        .attr("cy", function (d) {
            return y(d.NumberOfUsages);
        })
        .style("fill", "#69b3a2")
        .on("mouseover", function () {
            tip.style("display", null);
        })
        .on("mouseout", function () {
            tip.style("display", "none");
        })
        .on("mousemove", function (d) {
            return tip
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + 10 + "px")
                .style("visibility", "visible")
                .html(function () {
                    return '<div style = "font-size: smaller"><b>Unlocks</b>' +
                        '<p>Date: ' + d.Dates + '</p><p>Usages: ' + d.NumberOfUsages +
                        "</p><p>Number of Users: " + d.NumberOfUsers
                    '</div>';
                })
        });

    var countLocks = 0, countUnlocks = 0;


    svg.append("rect").attr("x", 1000).attr("y", 40)
        .attr("width", 15)
        .attr("height", 15)
        .on("click", function () { updateLocks() })
        .style("fill", "brown").style("cursor", "pointer");

    svg.append("rect").attr("x", 1000).attr("y", 70)
        .attr("width", 15)
        .attr("height", 15)
        .on("click", function () { updateUnlocks() })
        .style("fill", "#69b3a2").style("cursor", "pointer");

    svg.append("text").attr("x", 1020).attr("y", 50).text("Locks")
        .on("click", function () { updateLocks() })
        .style("font-size", "15px").attr("alignment-baseline", "middle").style("cursor", "pointer");

    svg.append("text").attr("x", 1020).attr("y", 80).text("Unlocks")
        .on("click", function () { updateUnlocks() })
        .style("font-size", "15px").attr("alignment-baseline", "middle").style("cursor", "pointer");

    function updateLocks() {
        if (countLocks % 2 == 0) {
            locks.selectAll("circle").style("visibility", "hidden");
            countLocks += 1;
        }
        else {
            locks.selectAll("circle").style("visibility", "visible");
            countLocks += 1;

            locks.selectAll("circle")
                .data(lock_dict)
                .transition()
                .duration(500)
                .on("start", function () {
                    d3.select(this)
                        .attr("r", 10);
                })
                .delay(function (d, i) {
                    return i / lock_dict.length * 500;
                })
                .attr("cx", function (d) {
                    return x(d.Dates);
                })
                .attr("cy", function (d) {
                    return y(d.NumberOfUsages);
                })
                .on("end", function () {
                    d3.select(this)
                        .transition()
                        .duration(500)
                        .attr("r", 6);
                });

            svg.select(".x.axis")
                .transition()
                .duration(1000)
                .call(x);

            svg.select(".y.axis")
                .transition()
                .duration(100)
                .call(y);
        }
    }

    function updateUnlocks() {
        if (countUnlocks % 2 == 0) {
            unlocks.selectAll("circle").style("visibility", "hidden");
            countUnlocks += 1;

        }
        else {
            unlocks.selectAll("circle").style("visibility", "visible");
            countUnlocks += 1;

            unlocks.selectAll("circle")
                .data(unlock_dict)
                .transition()
                .duration(500)
                .on("start", function () {
                    d3.select(this)
                        .attr("r", 10);
                })
                .delay(function (d, i) {
                    return i / unlock_dict.length * 500;
                })
                .attr("cx", function (d) {
                    return x(d.Dates);
                })
                .attr("cy", function (d) {
                    return y(d.NumberOfUsages);
                })
                .on("end", function () {
                    d3.select(this)
                        .transition()
                        .duration(500)
                        .attr("r", 6);
                });

            svg.select(".x.axis")
                .transition()
                .duration(1000)
                .call(x);

            svg.select(".y.axis")
                .transition()
                .duration(100)
                .call(y);

        }
    }




});