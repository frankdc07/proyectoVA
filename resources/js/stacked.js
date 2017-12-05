
var margin = {
	top: stacked.offsetWidth * .06,
	right: stacked.offsetWidth * .06,
	bottom: stacked.offsetWidth * .08,
	left: stacked.offsetWidth * .14
},
width = stacked.offsetWidth - margin.left - margin.right,
height = (width * 1.68) - margin.top - margin.bottom;
var y = d3version3.scale.ordinal()
	.rangeRoundBands([0, height], .1);

var x = d3version3.scale.linear()
	.rangeRound([width, 0]);

var color = d3version3.scale.ordinal()
	.range(["#dae811", "#e5f13b", "#ebf46b", "#f2f89a", "#f8fbca"]);

var xAxis = d3version3.svg.axis()
	.scale(x)
	.orient("top")
	.tickFormat(d3version3.format(".2s"));

var yAxis = d3version3.svg.axis()
	.scale(y)
	.orient("left");

var svgSB = d3version3.select(".stackedbch").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)   
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var active_link; //to control legend selections and hover
var legendClicked; //to control legend selections
var legendClassArray = []; //store legend classes to select bars in plotSingle()
var x_orig; //to store original y-posn

var formatComma = d3version3.format(',');

function createStackedChart(data) {

	active_link = "0";
    legendClicked = "";
    
    svgSB.selectAll('g').remove();

    svgSB
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	color.domain(d3version3.keys(data[0]).filter(function (key) {
			return key !== "Departamento" && key !== "Año" && key !== "ages" && key !== "total";
		}));
    
	data.sort(function (a, b) {
		return b.total - a.total;
	});

	y.domain(data.map(function (d) {
			return d.Departamento;
		}));
	x.domain([d3version3.max(data, function (d) {
				return d.total;
			}), 0]);
    
    var div = d3version3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);


	svgSB.append("g")
	.attr("class", "x axis")
	.call(xAxis);

	svgSB.append("g")
	.attr("class", "y axis")
	.call(yAxis)    
	.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", ".71em")
	.style("text-anchor", "end");
	//.text("Population");

	var dpto = svgSB.selectAll(".dpto")
		.data(data)
		.enter().append("g")
		.attr("class", "g")
		.attr("transform", "translate(0,0)");

	dpto.selectAll("rect")
	   .data(function (d) {
		  return d.ages;
	   })
	   .enter().append("rect")
	       .attr("x", function (d) {
		      return x(d.x0);
	       })
	       .attr("width", 0)
	       .attr("y", function (d) { //add to stock code
                return y(d.mydpto)
	       })
	       .attr("height", y.rangeBand())
	       .attr("class", function (d) {
		      classLabel = d.name.replace(/\s/g, ''); //remove spaces
		      return "class" + classLabel;
	       })
	       .style("fill", function (d) {
                if (d.mydpto === selectedDpto){
                    return "#c01719";
                }else{
		              return color(d.name);
                }
	       })    			
            .style("opacity", 0.5)
            .transition()
            .duration(1000)
            .attr("width", function (d) {
		      return x(d.x1) - x(d.x0);
	       })  			
            .style("opacity", 1);


	dpto.selectAll("rect")
	.on("mouseover", function (d) {
        if (active_link === "0" || d.name === legendClicked){

		var delta = d.x1 - d.x0;
		var xPos = parseFloat(d3version3.select(this).attr("x"));
		var yPos = parseFloat(d3version3.select(this).attr("y"));
		var width = parseFloat(d3version3.select(this).attr("width"));
		var height = parseFloat(d3version3.select(this).attr("height"));

		d3version3
            .select(this)
            .attr("stroke", "blue")
            .attr("stroke-width", 0.8)
            .style("opacity", 0.5);
          div.transition()		
                .duration(200)		
                .style("opacity", .9);
        var icon ='"ion-leaf"'
          div.html("<i class=" + icon + " ></i><b> " + d.name + "</b></br>" + formatComma(delta) + " Hectáreas")	
                .style("left", (d3version3.event.pageX + 15 ) + "px")		
                .style("top", (d3version3.event.pageY - 45) + "px");
        }
	})
	.on("mouseout", function () {
        div.transition()		
        .duration(500)		
        .style("opacity", 0);	
		d3version3
            .select(this)
            .attr("stroke", "pink")
            .attr("stroke-width", 0.2)
            .style("opacity", 1)
            .style("fill",  function (d) {
                if (d.mydpto === selectedDpto){
                    return "#c01719";
                }else{
		              return color(d.name);
                }
            });
	});
    
    

	var legend = svgSB.selectAll(".legend")
		.data(color.domain().slice().reverse())
		.enter().append("g")
		//.attr("class", "legend")
		.attr("class", function (d) {
			legendClassArray.push(d.replace(/\s/g, '')); //remove spaces
			return "legend";
		})
		.attr("transform", function (d, i) {
			return "translate(0," + (i * width * 0.06) + ")";
		});
    
    var yearLabel = svgSB.selectAll(".yearlabel")
		.data([1])
        .enter().append("g")
		.attr("class", "yearlabel")
		.attr("transform", function (d, i) {
			return "translate(0," + (i * width * 0.06) + ")";
		});
    
    yearLabel.append("text")
	.attr("x", width - 24)
	.attr("y", height * .22)
	.attr("dy", ".35em")
	.style("text-anchor", "end")
	.text(selectValue);

	//reverse order to match order in which bars are stacked
	legendClassArray = legendClassArray.reverse();

	legend.append("rect")
	.attr("x", width * .7)
	.attr("y", height * .3)
	.attr("width", width * .04)
	.attr("height", width * .04)
	.style("fill", color)
	.attr("id", function (d, i) {
		return "id" + d.replace(/\s/g, '');
	})
	.on("mouseover", function () {

		if (active_link === "0")
			d3version3.select(this).style("cursor", "pointer");
		else {
			if (active_link.split("class").pop() === this.id.split("id").pop()) {
				d3version3.select(this).style("cursor", "pointer");
			} else
				d3version3.select(this).style("cursor", "auto");
		}
	})
	.on("click", function (d) {

		if (active_link === "0") { //nothing selected, turn on this selection
			d3version3.select(this)
			.style("stroke", "black")
			.style("stroke-width", 2);

			legendClicked = d;
            active_link = this.id.split("id").pop();
			plotSingle(this);

			//gray out the others
			for (i = 0; i < legendClassArray.length; i++) {
				if (legendClassArray[i] != active_link) {
					d3version3.select("#id" + legendClassArray[i])
					.style("opacity", 0.5);
				}
			}

		} else { //deactivate
			if (active_link === this.id.split("id").pop()) { //active square selected; turn it OFF
				d3version3.select(this)
				.style("stroke", "none");

				active_link = "0"; //reset

				//restore remaining boxes to normal opacity
				for (i = 0; i < legendClassArray.length; i++) {
					d3version3.select("#id" + legendClassArray[i])
					.style("opacity", 1);
				}

				//restore plot to original
				restorePlot(d);

			}

		} //end active_link check


	});

	legend.append("text")
	.attr("x", width *.9)
	.attr("y", height * .31 )
	.attr("dy", ".35em")
	.style("text-anchor", "end")
	.text(function (d) {
		return d;
	});

	function restorePlot(d) {

		dpto.selectAll("rect").forEach(function (d, i) {
			//restore shifted bars to original posn
			d3version3.select(d[idx])
			.transition()
			.duration(1000)
			.attr("x", x_orig[i]);
		})

		//restore opacity of erased bars
		for (i = 0; i < legendClassArray.length; i++) {
			if (legendClassArray[i] != class_keep) {
				d3version3.selectAll(".class" + legendClassArray[i])
				.transition()
				.duration(1000)
				.delay(750)
				.style("opacity", 1);
			}
		}

	}

	function plotSingle(d) {

		class_keep = d.id.split("id").pop();
		idx = legendClassArray.indexOf(class_keep);

		//erase all but selected bars by setting opacity to 0
		for (i = 0; i < legendClassArray.length; i++) {
			if (legendClassArray[i] != class_keep) {
				d3version3.selectAll(".class" + legendClassArray[i])
				.transition()
				.duration(1000)
				.style("opacity", 0);
			}
		}

		//lower the bars to start on y-axis
		x_orig = [];
		dpto.selectAll("rect").forEach(function (d, i) {

			//get width and x posn of base bar and selected bar
			w_keep = d3version3.select(d[idx]).attr("width");
			x_keep = d3version3.select(d[idx]).attr("x");
			//store x_base in array to restore plot
			x_orig.push(x_keep);

			x_base = d3version3.select(d[0]).attr("x");

			x_new = x_base;

			//reposition selected bars
			d3version3.select(d[idx])
			.transition()
			.ease("bounce")
			.duration(1000)
			.delay(750)
			.attr("x", x_new);

		})

	}

};
