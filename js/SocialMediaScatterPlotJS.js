$("head").append('<script type="text/javascript" src="js/scripts.js"></script>');

      const xValue = d => d.SelfReportTotalAppMins;
      const xLabel = 'Total time spent';
      const yValue = d => d.SelfReportSocialMediaMins;
      const yLabel = 'Social time';
      const colorValue = d => d.EmotionTimeUsePhonePerDay;
      const colorLabel = 'Emotions';
      const margin = { left: 120, right: 300, top: 20, bottom: 120 };

      const svg = d3.select('svg');
      const width = svg.attr('width');
      const height = svg.attr('height');
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const g = svg.append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);
      const xAxisG = g.append('g')
          .attr('transform', `translate(0, ${innerHeight})`);
      const yAxisG = g.append('g');
      const colorLegendG = g.append('g')
          .attr('transform', `translate(${innerWidth + 60}, 150)`);

      xAxisG.append('text')
          .attr('class', 'axis-label')
          .attr('x', innerWidth / 2)
          .attr('y', 100)
          .text(xLabel);

      yAxisG.append('text')
          .attr('class', 'axis-label')
          .attr('x', -innerHeight / 2)
          .attr('y', -60)
          .attr('transform', `rotate(-90)`)
          .attr('margin', `5px`)
          .style('text-anchor', 'middle')
          .text(yLabel);

      colorLegendG.append('text')
          .attr('class', 'legend-label')
          .attr('x', -30)
          .attr('y', -40)
          .text(colorLabel);

      const xScale = d3.scaleLinear();
      const yScale = d3.scaleLinear();
      const colorScale = d3.scaleOrdinal()
        .range(d3.schemeCategory10);

      const xAxis = d3.axisBottom()
        .scale(xScale)
        .tickPadding(15)
        .tickSize(-innerHeight);

      const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(5)
        .tickPadding(15)
        .tickSize(-innerWidth);

      const colorLegend = d3.legendColor()
        .scale(colorScale)
        .shape('circle');

      const row = d => {
        d.SelfReportSocialMediaMins = +d.SelfReportSocialMediaMins;
        d.SelfReportTotalAppMins = +d.SelfReportTotalAppMins;
        return d;
      };

      d3.csv('csv/SelfReportSocialMediaMins.csv', row, data => {
        xScale
          .domain(d3.extent(data, xValue))
          .range([0, innerWidth])
          .nice();

        yScale
          .domain(d3.extent(data, yValue))
          .range([innerHeight, 0])
          .nice();

        g.selectAll('circle').data(data)
          .enter().append('circle')
            .attr('cx', d => xScale(xValue(d)))
            .attr('cy', d => yScale(yValue(d)))
            .attr('fill', d => colorScale(colorValue(d)))
            .attr('fill-opacity', 0.6)
            .attr('r', 8);

        xAxisG.call(xAxis);
        yAxisG.call(yAxis);
        colorLegendG.call(colorLegend)
          .selectAll('.cell text')
            .attr('dy', '0.1em');
      });

      $(function() {




        let colortext = ""
        let emotionState = ""
        for (let index = 0; index < 5; index++) {
          if(index == 4){
            $(`body > svg > g > g:nth-child(3) > g > g:nth-child(5)`).remove()
            $(`[fill='#9467bd']`).remove()
          }
          let elmt =  $(`body > svg > g > g:nth-child(3) > g > g:nth-child(${index}) >  text`)

          if(elmt.text() == "1"){
            elmt.text("Happy")
          }else if (elmt.text() == "2") {
            elmt.text("SomeWhat Happy")
          }else if (elmt.text() == "3") {
            elmt.text("SomeWhat UnHappy")
          }else if (elmt.text() == "4") {
            elmt.text("UnHappy")
          }
        }

        $("body > svg > g > g:nth-child(3) > g > g:nth-child(1)").hover(function() {
          showOnlyBlue()
        });

        $("body > svg > g > g:nth-child(3) > g > g:nth-child(2)").hover(function() {
          showOnlyOrange()
        });

        $("body > svg > g > g:nth-child(3) > g > g:nth-child(3)").hover(function() {
          showOnlyGreen()
        });

        $("body > svg > g > g:nth-child(3) > g > g:nth-child(4)").hover(function() {
          showOnlyRed()
        });

        const allColorSelectors = "body > svg > g > g:nth-child(3) > g > g:nth-child(1), body > svg > g > g:nth-child(3) > g > g:nth-child(2), body > svg > g > g:nth-child(3) > g > g:nth-child(3), body > svg > g > g:nth-child(3) > g > g:nth-child(4)";

        $( `${allColorSelectors}` ).mouseleave( function(){showAll()} );


      });

