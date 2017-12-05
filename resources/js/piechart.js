
var marginP = {
	top: pie.offsetWidth * .06,
	right: pie.offsetWidth * .06,
	bottom: pie.offsetWidth * .03,
	left: pie.offsetWidth * .08
},
widthP = pie.offsetWidth - marginP.left - marginP.right,
heightP = (widthP / 1.4) - marginP.top - marginP.bottom;

var svgP = d3version4.select(".piechart").append("svg")
	.attr("width", widthP + marginP.left + marginP.right)
	.attr("height", heightP + marginP.top + marginP.bottom);


var formF = d3version4.format(".1f");
    
function createPieChart(data) {   

    
svgP.selectAll('g').remove();


var radius = Math.min(widthP, heightP) / 2,
    g = svgP.append("g").attr("transform", "translate(" + widthP / 2 + "," + heightP / 2 + ")");

var colorP = d3version4.scaleOrdinal(["#14c819", "#e4d81b", "#82baf3"]);

var pie = d3version4.pie()
    .sort(null)
    .value(function(d) { return d.valor; });

var path = d3version4.arc()
    .outerRadius(radius - 20)
    .innerRadius(0);

var label = d3version4.arc()
    .outerRadius(radius)
    .innerRadius(0);
    
var labelDpto = svgP.selectAll(".labdepto") // note appending it to mySvg and not svg to make positioning easier
    .data(pie(data))
    .enter().append("g")
    .attr("transform", function(d,i){
        return "translate(" + (widthP * .08) + "," + (heightP) + ")"; // place each legend on the right and bump each one down 15 pixels
    })
    .attr("class", "labdepto");

labelDpto.append("text")
    .text(selectedDpto);

  var arc = g.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  arc.append("path")
      .attr("d", path)
      .attr("fill", function(d) { return colorP(d.data.Tipo)});

  arc.append("text")
      .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
      .attr("dy", "0.40em")
      .text( function(d) { return formF(d.data.Porcentaje) + " %"});
    
    
    // again rebind for legend
    var legendG = svgP.selectAll(".legend") // note appending it to mySvg and not svg to make positioning easier
      .data(pie(data))
      .enter().append("g")
      .attr("transform", function(d,i){
        return "translate(" + (widthP * .75) + "," + (widthP * (i * 0.03 + 0.06)) + ")"; // place each legend on the right and bump each one down 15 pixels
      })
      .attr("class", "legend");   

    legendG.append("rect") // make a matching color rect
      .attr("width", widthP * 0.018)
      .attr("height", widthP * 0.018)
      .style("fill", function(d, i) {
        return colorP(d.data.Tipo);
      });

    legendG.append("text") // add the text
      .text(function(d){
        return d.data.Tipo;
      })
      .style("font-size", "65%")
      .attr("y", widthP * 0.018)
      .attr("x", widthP * 0.025);
    
    
}



