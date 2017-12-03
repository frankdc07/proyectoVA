
var selectedDpto;

var selectValue;

var dataPie;

var dataSB;

d3version4.csv("resources/data/superficie.csv", function(d) {
  d.valor = +d.valor;
  return d;
}, function(error, data) {
  if (error) throw error;
    selectedDpto= "CAQUETA";
    dataPie = data;
    var filteredData = data.filter(function(d) { return d.Departamento == selectedDpto; });     
    createPieChart(filteredData);
});
    



d3version3.csv("resources/data/data.csv", function(error, data) {   
    if (error) throw error;
    
    dataSB = data;
    
    var color = d3version3.scale.ordinal()
	.range(["#bfbf00"]);
    
	color.domain(d3version3.keys(data[0]).filter(function (key) {
			return key !== "Departamento" && key !== "Año";
		}));
    
    data.forEach(function (d) {
		var mydpto = d.Departamento; //add to stock code
		var x0 = 0;
		d.ages = color.domain().map(function (name) {
				return {
					mydpto: mydpto,
					name: name,
					x0: x0,
					x1: x0 += +d[name]
				};
			});
		d.total = d.ages[d.ages.length - 1].x1;

	});
    
    var anios = ["1990-2000", "2000-2005", "2005-2010", "2010-2012", "2013", "2014", "2015", "2016"];
    
    selectValue = "2016";

    var filteredData = data.filter(function(d) { return d.Año == selectValue; });
    
    createStackedChart(filteredData);
    
    var selection = d3version3.select('.selection')
      .append('select')
        .attr('class','select')
        .on('change',onchange);

    var options = selection
      .selectAll('option')
        .data(anios).enter()
        .append('option')
            .text(function (d) { return d; })
            .property('selected', selectValue);

    function onchange() {
        selectValue = d3version3.select('select').property('value');
        var filteredData = data.filter(function(d) { return d.Año == selectValue; }); 
        
        createStackedChart(filteredData);
    };

});