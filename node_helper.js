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

        var url = 'https://www.nordpoolgroup.com/api/marketdata/page/10?currency=';
        url = url + this.config.currency + ',' + this.config.currency + ',' + this.config.currency;
        url = url + '&endDate=' + date.format('dd-MM-yyyy');
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
            const data = result.data;
            if (data && data.Rows && data.Rows.length) {
                const values = []
                for (const row of data.Rows) {
                    if (row.IsExtraRow) {
                        continue
                    }
                    const date = moment(row.StartTime, 'YYYY-MM-DDTHH:mm:ss', true);
                    if (!date.isValid()) {
                        continue
                    }

                    for (const column of row.Columns) {
                        const value = parseFloat(column.Value.replace(/,/, '.').replace(/ /g, '')) / 1000
                        if (isNaN(value)) {
                            continue
                        }
                        const area = column.Name
                        if (this.config.area.indexOf(area) >= 0) {
                            if (date.format('HH') === now.format('HH'))
                                values.push({ label: date.format('HH'), y: value, color: "blue", indexLabel: value });
                            else
                            {
				if(value < 1.0)
                                	values.push({ label: date.format('HH'), y: value, color: "green" })
                                else if(value < 2.0)
                                	values.push({ label: date.format('HH'), y: value, color: "orange" })
				else
                                	values.push({ label: date.format('HH'), y: value, color: "red" })
                            }
                        }
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
