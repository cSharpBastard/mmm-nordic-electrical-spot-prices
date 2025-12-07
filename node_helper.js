'use strict';
require('dotenv').config();
const request = require('request');
const moment = require('moment');
const NodeHelper = require('../../js/node_helper');
const fs = require('fs');

module.exports = NodeHelper.create({
    config: {},
    start: function () {},
    error: function (msg){
	this.sendSocketNotification('ERROR', msg);
    },
    getData: function (p_date) {
        const self = this;
	self.error("getData");
        const date = moment(p_date);
        const url = 'https://www.elprisetjustnu.se/api/v1/prices/' + date.format('yyyy/MM-DD_') + this.config.area + '.json';
	const filePath = '/tmp/elpriser.json';
	fs.readFile(filePath, 'utf8', (err, data) => {
		if(err){
			self.error(err);
			return;
		}
		const result = JSON.parse(data);
		self.gotData(result);
	});
    },
    gotData: function (result) {
        try {
            this.error("gotData");
            const now = moment(new Date());
            const data = result;
            if (data) {
                const values = []
		for (let i = 0; i < data.length; i++) {
                    const row = data[i];
                    const date = moment(row.time_start.substring(0,19), 'YYYY-MM-DDTHH:mm:ss', true);
                    if (!date.isValid()) {
			this.error("Invalid date");
                        continue;
                    }

                    const value = (this.config.currency === 'EUR') ? parseFloat(row.EUR_per_kWh) : parseFloat(row.SEK_per_kWh);
                    if (isNaN(value)) {
			this.error("NaN");
                        continue;
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
                this.error("Invalid data:" + data);
        } catch (ex) {
            this.error(ex);
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
