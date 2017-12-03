
var marginP = {
	top: 20,
	right: 20,
	bottom: 30,
	left: 30
},
widthP = (1140 * 0.3) - marginP.left - marginP.right,
heightP = 350 - marginP.top - marginP.bottom;


var svgP = d3version4.select(".piechart").append("svg")
	.attr("width", widthP + marginP.left + marginP.right)
	.attr("height", heightP + marginP.top + marginP.bottom);
    
function createPieChart(data) {   

    
svgP.selectAll('g').remove();


var radius = Math.min(widthP, heightP) / 2,
    g = svgP.append("g").attr("transform", "translate(" + widthP / 2 + "," + heightP / 2 + ")");

var colorP = d3version4.scaleOrdinal(["#14c819", "#e4d81b", "#82baf3"]);

var pie = d3version4.pie()
    .sort(null)
    .value(function(d) { return d.valor; });

var path = d3version4.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var label = d3version4.arc()
    .outerRadius(radius - 200)
    .innerRadius(radius);

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
      .text( function(d) { return d.data.Tipo;});
}