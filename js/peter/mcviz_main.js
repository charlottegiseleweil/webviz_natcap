(function (mcviz) {
	'use strict';


	queue()
		.defer(d3.json, "static/data/n_frontier.json")
		.await(ready);

	function ready(error, frontierData) {
		if(error) {
			return console.warn(error);
		}

		mcviz.data.frontierData = frontierData;
		mcviz.initMenu();
		mcviz.onDataChange();
	}
}(window.mcviz = window.mcviz || {}));