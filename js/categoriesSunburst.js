const format = d3.format(",d");
const width = 932;
const radius = width / 6;

const arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius * 1.5)
    .innerRadius(d => d.y0 * radius)
    .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

const partition = data => {
    const root = d3.hierarchy(data)
        .sum(d => d.size)
        .sort((a, b) => b.value - a.value);
    return d3.partition()
        .size([2 * Math.PI, root.height + 1])
        (root);
}

const mid = [
    '#E3BA22',
    '#E58429',
    '#BD2D28',
    '#D15A86',
    '#8E6C8A',
    '#6B99A1',
    '#42A5B3',
    '#0F8C79',
    '#6BBBA1',
    '#5C8100'
];

const light = [
    '#F2DA57',
    '#F6B656',
    '#E25A42',
    '#DCBDCF',
    '#B396AD',
    '#B0CBDB',
    '#33B6D0',
    '#7ABFCC',
    '#C8D7A1',
    '#A0B700'
];
d3.json("../json/app_types_names_final.json", function (data) {

    console.log(data);
    const root = partition(data);

    const palettes = [light, mid];
    const lightGreenFirstPalette = palettes
        .map(d => d.reverse())
        .reduce((a, b) => a.concat(b));
    const color = d3.scaleOrdinal(lightGreenFirstPalette);

    root.each(d => d.current = d);

    const svg = d3.select('#partitionSVGSunburst')
        .style("height", "auto")
        .style("font", "10px sans-serif")



    const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${width / 2})`);

    const path = g.append("g")
        .selectAll("path")
        .data(root.descendants().slice(1))
        .enter()
        .append("path")
        .attr("fill", d => {
            while (d.depth > 1)
                d = d.parent;
            return color(d.data.name);
        })
        .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
        .attr("d", d => arc(d.current))
        .on("mouseover", mouseover)
        .on('mousemove', function (d) {
            tooltip.style('top', (d3.event.layerY + 10) + 'px');
            tooltip.style('left', (d3.event.layerX + 10) + 'px')
        })
        .on('mouseout', function () {
            tooltip.style('display', 'none');
        })



    path.filter(d => d.children)
        .style("cursor", "pointer")
        .on("click", clicked)

    const label = g.append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
        .selectAll("text")
        .data(root.descendants().slice(1))
        .enter()
        .append("text")
        .attr("dy", "0.35em")
        .attr("fill-opacity", d => +labelVisible(d.current))
        .attr("transform", d => labelTransform(d.current))
        .text(d => d.data.name)

    const parent = g.append("circle")
        .datum(root)
        .attr("r", radius)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("click", clicked);

    function clicked(p) {
        parent.datum(p.parent || root);

        root.each(d => d.target = {
            x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth)
        });

        const t = g.transition().duration(750);

        path.transition(t)
            .tween("data", d => {
                const i = d3.interpolate(d.current, d.target);
                return t => d.current = i(t);
            })
            .filter(function (d) {
                return +this.getAttribute("fill-opacity") || arcVisible(d.target);
            })
            .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
            .attrTween("d", d => () => arc(d.current));

        label.filter(function (d) {
            return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        }).transition(t)
            .attr("fill-opacity", d => +labelVisible(d.target))
            .attrTween("transform", d => () => labelTransform(d.current));
    }

    function arcVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d) {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2 * radius;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }

    d3.select("#partitionSVGSunburst").on("mouseleave", mouseleave);

    var tooltip = d3.select('body')
        .append('div').classed('tooltipSunburst', true);
    tooltip.append('div')
        .attr('class', 'label');
    tooltip.append('div')
        .attr('class', 'count');
    tooltip.append('div')
        .attr('class', 'percent');

    function mouseleave(d) {
        d3.selectAll("path").on("mouseover", null);

        d3.selectAll("path")
            .transition()
            .duration(1000)
            .style("opacity", 1)
            .on("end", function () {
                d3.select(this).on("mouseover", mouseover);
            });
    }


    function mouseover(d) {

        console.log(d.value)

        var sequenceArray = getAncestors(d);

        d3.selectAll("path")
            .style("opacity", 0.3)

        tooltip.select('.label').html("Name: " + d.data.name); 
        tooltip.select('.count').html("Count: " + d.value);
        tooltip.style('display', 'block');

        svg.selectAll("path")
            .filter(function (node) {
                return (sequenceArray.indexOf(node) >= 0);
            })
            .style("opacity", 1);
    }


    function getAncestors(node) {
        var path = [];
        var current = node;
        while (current.parent) {
            path.unshift(current);
            current = current.parent;
        }
        return path;
    }




});