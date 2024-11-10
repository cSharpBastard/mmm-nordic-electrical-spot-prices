'use strict';

Module.register("mmm-nordic-electrical-spot-prices", {
    requiresVersion: "2.1.0",
    defaults: {
        currency: "SEK", // can also be 'EUR'
        area: "SE3", // See https://www.elprisetjustnu.se/elpris-api
        updateInterval: 3600000,
        title: "Dagens priser",
        yLegend: "Kr / kWh"
    },
    dataPoints: [],
    chart: {},
    getScripts: function () {
        return [
            this.file('node_modules/moment/min/moment.min.js'),
            this.file('canvasjs.min.js')
        ];
    },
    start: function () {
        const self = this;
        self.shareConfig();
        setTimeout(function () { self.getData() }, 3000);
        self.scheduleUpdate();
    },
    scheduleUpdate: function () {
        const self = this;
        console.log("mmm-nordic-electrical-spot-prices scheduleUpdate Start");

        setInterval(function () { self.getData() }, self.config.updateInterval);
    },
    getHeader: function () {
	const self = this;
        return self.config.title;
    },
    shareConfig: function () {
	const self = this;
        self.sendSocketNotification('SET_CONFIG', self.config);
    },
    getData: function () {
	const self = this;
        const date = moment();
        self.sendSocketNotification('GET_SPOTDATA', date);
    },
    getDom: function () {
        var self = this;
        var wrapper = document.createElement("div");
        wrapper.id = "chartContainer";
        setTimeout(function () { self.createChart(wrapper.id); }, 1000);
        return wrapper;
    },
    socketNotificationReceived: function (notification, payload) {
	const self = this;
        if (notification === "SPOT_RECEIVED") {
            console.log("gotData");
            self.dataPoints = payload;
            self.updateDom(self.config.fadeSpeed);
        }
        else
            console.log(payload);
    },
    createChart: function (id) {
	const self = this;
        self.chart = new CanvasJS.Chart(id, {
            animationEnabled: false,
            theme: "dark1",
            backgroundColor: "",
            axisY: {
                title: self.config.yLegend,
                titleFontSize: 24
            },
            axisX: {
                interval: 1,
                indexLabelColor: "red"
			},
            data: [{
                type: "column",
                yValueFormatString: "#.00",
                showInLegend: false, 
                color: "gray",
                dataPoints: self.dataPoints
            }]
        });
        self.chart.render();
    }
});
