'use strict';

Module.register("mmm-nordic-electrical-spot-prices", {
    requiresVersion: "2.1.0",
    defaults: {
        currency: "SEK", // can also be 'DKK', 'EUR', 'NOK'
        area: "SE3", // See http://www.nordpoolspot.com/maps/
        updateInterval: 3600000,
        title: "Dagens priser",
        yLegend: "Kr / kWh"
    },
    dataPoints: {},
    chart: {},
    getScripts: function () {
        return [
            this.file('moment.min.js'),
            this.file('canvasjs.min.js')
        ];
    },
    start: function () {
        const self = this;
        this.shareConfig();
        setTimeout(function () { self.getData() }, 3000);
        this.scheduleUpdate();
    },
    scheduleUpdate: function (delay) {
        const self = this;
        console.log("mmm-nordic-electrical-spot-prices scheduleUpdate Start:" + String(delay));
        
        setInterval(function () { self.getData() }, this.config.updateInterval);
    },
    getHeader: function () {
        return this.config.title;
    },
    shareConfig: function () {
        this.sendSocketNotification('SET_CONFIG', this.config);
	},
    getData: function () {
        const date = moment(new Date());
        this.sendSocketNotification('GET_SPOTDATA', date);
	},
    getDom: function () {
        var self = this;
        var wrapper = document.createElement("div");
        wrapper.id = "chartContainer";
        setTimeout(function () { self.createChart(wrapper.id); }, 1000);
        return wrapper;
    },
    socketNotificationReceived: function (notification, payload) {
        if (notification === "SPOT_RECEIVED") {
            this.dataPoints = payload;
            this.updateDom(this.config.fadeSpeed);
        }
    },
    createChart: function (id) {
        this.chart = new CanvasJS.Chart(id, {
            animationEnabled: false,
            theme: "dark1",
            axisY: {
                title: this.config.yLegend,
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
                dataPoints: this.dataPoints
            }]
        });
        this.chart.render();
	}
});
