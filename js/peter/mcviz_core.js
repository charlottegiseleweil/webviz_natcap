/* global $, _, crossfilter, d3 */
(function (mcviz) {
	'use strict';

	mcviz.data = {}; // our main data object
	mcviz.activeValue = null;
	mcviz.activePoint = 0;
	mcviz.VALUES = ['nreduc', 'preduc', 'sreduc'];
	mcviz.LULC_NAMES = ['AllCrop','CC','CT','Forest','GrW','NT',
					    'NTCC','Prairie','RF','RFCC','RFNT','RFNTCC']
	mcviz.LULC_COLORS = {
		AllCrop:'yellow',
		Developed:'grey',
		CC:'darkkhaki',
		Forest:'forestgreen',
		GrW:'greenyellow',
		NT:'wheat',
		Prairie:'mediumseagreen',
		RF:'burlywood',
		RFCC:'darksalmon',
		RFNT:'darkorange',
		RFNTCC:'saddlebrown',
		Pasture:'lightpink',
		Wetland:'darkturquoise',
		Baseline:'dimgrey',
		NTCC:'olive',
		CT:'tomato',
		Water:'royalblue'
	};
	mcviz.mapWidth = 650;
	mcviz.mapHeight = 350;

	mcviz.initMenu = function() {
		// Configures the value-selection menu dropdown
		var valSelect = d3.select('#value-select select');
		valSelect.selectAll('option')
			.data(mcviz.VALUES).enter()
			.append('option')
			.attr('value', function(d) { return d; })
			.html(function(d) { return d; });
		valSelect.on('change', function(d) {
			var value = d3.select(this).property('value');
			mcviz.activeValue = value;
			mcviz.onDataChange();
		});
		mcviz.activeValue = mcviz.VALUES[0];

	};

	mcviz.getValueData = function(){
		var value = mcviz.activeValue;
		var data = mcviz.data.frontierData.map(o => o[value]);
		return data;
	};

	mcviz.getFrontierData = function() {
		var xval = 'cost';
		var yval = mcviz.activeValue;
		var data = mcviz.data.frontierData.map(
			function(d) {
				return {xval: d[xval], yval:d[yval]};
			});
		return data;
	};

	mcviz.getPieData = function() {
		var data = mcviz.data.frontierData.find(function(d) {
					return d['solution']==mcviz.activePoint;
		});
		return data;
	}

	mcviz.onDataChange = function() {
		// var data = mcviz.getValueData();
		// mcviz.updateBarChart(data);
		var data = mcviz.getFrontierData();
		mcviz.updateFrontierPlot(data);
		mcviz.newPointSelected();
	};

	mcviz.newPointSelected = function() {
		console.log('point: '+mcviz.activePoint);
		mcviz.updateMap(mcviz.activePoint);

		var data = mcviz.getPieData();
		mcviz.updatePiePlot(data, mcviz.LULC_NAMES, mcviz.LULC_COLORS);
	}


}(window.mcviz = window.mcviz || {}));