

/*Copyright (c) 2016, Tom May 

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/

   
      const marginHM = { top: 50, right: 0, bottom: 100, left: 75 },
          widthHM = chart.offsetWidth - marginHM.left - marginHM.right,
          gridSize = Math.floor(widthHM / 8),
          heigtR = gridSize/2,
          heightHM = (widthHM * 2.5)- marginHM.top - marginHM.bottom,
          legendElementWidth = gridSize - 14,
          colors = ["#84db1f", "#9ce548","#ace966","#efe776","#eae048", "#d5c919", "#f77418", "#e56308", "#e82d1c"], // alternatively colorbrewer.YlGnBu[9]
          dptos = ["AMAZONAS", "ANTIOQUIA", "ARAUCA", "ATLANTICO", "BOGOTA DC", "BOLIVAR", "BOYACA", "CALDAS", "CAQUETA", "CASANARE", "CAUCA", "CESAR", "CHOCO", "CORDOBA", "CUNDINAMARCA", "GUAINIA", "GUAVIARE", "HUILA", "LA GUAJIRA", "MAGDALENA", "META", "NARIÑO", "NORTE DE SANTANDER", "PUTUMAYO", "QUINDIO", "RISARALDA", "SAN ANDRÉS Y PROVIDENCIA", "SANTANDER", "SUCRE", "TOLIMA", "VALLE DEL CAUCA", "VAUPES", "VICHADA"],
          times = ["1990-2000", "2000-2005", "2005-2010", "2010-2012", "2013", "2014", "2015", "2016"];
          datasets = ["resources/data/data.tsv"];

      const svgHM = d3version4.select("#chart").append("svg")
          .attr("width", widthHM + marginHM.left + marginHM.right)
          .attr("height", heightHM + marginHM.top + marginHM.bottom)
          .append("g")
          .attr("transform", "translate(" + marginHM.left + "," + marginHM.top + ")");

      const dptoLabels = svgHM.selectAll(".dptoLabel")
          .data(dptos)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", (d, i) => i * heigtR)
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + heigtR / 1.5 + ")")
            .attr("class", (d, i) => ((i >= 0 && i <= 4) ? "dptoLabel mono axis axis-workweek" : "dptoLabel mono axis"));

      const timeLabels = svgHM.selectAll(".timeLabel")
          .data(times)
          .enter().append("text")
            .text((d) => d)
            .attr("x", (d, i) => i * gridSize)
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("class", (d, i) => ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"));

      const type = (d) => {
        return {
          departamento: +d.departamento,
          periodo: +d.periodo,
          valor: +d.valor
        };
      };

      const heatmapChart = function(tsvFile) {
        d3version4.tsv(tsvFile, type, (error, data) => {
            
          const colorScale = d3version4.scaleQuantile()
            .domain([0, d3version4.max(data, (d) => d.valor) / 2, d3version4.max(data, (d) => d.valor)])
            .range(colors);

          const cards = svgHM.selectAll(".periodo")
              .data(data, (d) => d.departamento+':'+d.periodo);
            
    var div = d3version4.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

          cards.append("title");

          cards.enter().append("rect")
              .attr("x", (d) => (d.periodo - 1) * gridSize)
              .attr("y", (d) => (d.departamento - 1) * heigtR)
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("class", "periodo bordered")
              .attr("width", gridSize)
              .attr("height", heigtR)
              .style("fill", colors[2])
                .on("mouseover", function (d) {
                    d3version4
                        .select(this)
                            .style("opacity", .6);
                  div.transition()		
                    .duration(200)		
                    .style("opacity", .9);	
                    var icon ='"ion-leaf"'	
                  div.html("<i class=" + icon + " ></i><b> Hectáreas</b></br>" + formatComma(d.valor))	
                    .style("left", (d3version4.event.pageX + 15 ) + "px")		
                    .style("top", (d3version4.event.pageY - 45) + "px");
                    
                })            
                .on("mouseout", function (d) {
                    d3version4
                        .select(this)
                            .style("opacity", 1);
                    div.transition()		
                    .duration(500)		
                    .style("opacity", 0)})
                .on("click", function (d) {
                    selectedDpto=dptos[d.departamento-1];
                    var filteredData = dataPie.filter(function(d) { return d.Departamento == selectedDpto; }); 
                    createPieChart(filteredData);
              
                    selectValue = times[d.periodo-1];                    
                    var filteredData = dataSB.filter(function(d) { return d.Año == selectValue; }); 
                    createStackedChart(filteredData);                    
                    })
            .merge(cards)
              .transition()
              .duration(1000)
              .style("fill", (d) => colorScale(d.valor));
            
          cards.select("title").text((d) => d.valor);

          cards.exit().remove();

          const legend = svgHM.selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), (d) => d);

          const legend_g = legend.enter().append("g")
              .attr("class", "legend");

          legend_g.append("rect")
            .attr("x", (d, i) => legendElementWidth * i)
            .attr("y", heightHM)
            .attr("width", legendElementWidth)
            .attr("height", heigtR / 2)
            .style("fill", (d, i) => colors[i]);

          legend_g.append("text")
            .attr("class", "mono")
            .text((d) => "≥ " + Math.round(d))
            .attr("x", (d, i) => legendElementWidth * i)
            .attr("y", heightHM + heigtR );

          legend.exit().remove();
        });
      };

      heatmapChart(datasets[0]);

