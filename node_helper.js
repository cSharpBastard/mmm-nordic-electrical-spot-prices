'use strict';
const NodeHelper = require('node_helper');
const request = require('request');
const moment = require('moment');

module.exports = NodeHelper.create({
    config: {},
    start: function () { },
    getData: function (p_date) {
        const self = this;
        const date = moment(p_date);
        var url = 'https://www.elprisetjustnu.se/api/v1/prices/' + date.format('yyyy[/]MM-dd[_]') + config.area + '.json';
        request({ url: url, method: 'GET' }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
                self.gotData(result);
            }
        });
    },
    gotData: function (result) {
        try {
            const now = moment(new Date());
            const data = result;
            if (data) {
                const values = []
                for (const row of data) {
                    const date = moment(row.time_start, 'YYYY-MM-DDTHH:mm:ss', true);
                    if (!date.isValid()) {
                        continue
                    }

                    const value = (config.currency === 'EUR') ? parseFloat(row.EURper_kWh) : parseFloat(row.SEK_per_kWh);
                    if (isNaN(value)) {
                        continue
                    }
                    if (date.format('HH') === now.format('HH'))
                        values.push({ label: date.format('HH'), y: value, color: "blue", indexLabel: value });
                    else
                    {
                       if(value < 1.0)
                            values.push({ label: date.format('HH'), y: value, color: "green" })
                        else if(value < 2.0)
                            values.push({ label: date.format('HH'), y: value, color: "yellow" })
                        else if(value < 3.0)
                            values.push({ label: date.format('HH'), y: value, color: "gold" })
                        else if(value < 4.0)
                            values.push({ label: date.format('HH'), y: value, color: "orange" })
                        else
                            values.push({ label: date.format('HH'), y: value, color: "red" })
                    }
                }
                this.sendSocketNotification('SPOT_RECEIVED', values);
            }
            else
                console.log("Invalid data:" + data);
        } catch (ex) {
            console.error(ex);
		}
	},
    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function (notification, payload) {
        if (notification === 'GET_SPOTDATA') {
            this.getData(payload);
        } else if (notification === 'SET_CONFIG') {
            this.config = payload;
		}
    }
});
