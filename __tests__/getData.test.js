const request = require('request');
const moment = require('moment');
jest.mock('request');  // Mock the request module

// Implement the getData function here
function getData(p_date, config, callback) {
    const date = moment(p_date);
    const url = 'https://www.elprisetjustnu.se/api/v1/prices/' + date.format('YYYY[/]MM-DD[_]') + config.area + '.json';
    request({ url: url, method: 'GET' }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const result = JSON.parse(body);
            callback(result);
        }
    });
}

// Sample configuration object (you might need to adjust based on actual config)
const config = {
    area: 'SE3',
    currency: 'SEK'
};

// Sample test for the getData function
describe('getData', () => {
    beforeEach(() => {
        // Mock moment to control the date format
        jest.spyOn(moment.prototype, 'format').mockImplementation(function (format) {
            return '2024/01-01_SE3';  // Fixed format for testing
        });

        // Set up the mock for request to simulate an API response
        request.mockImplementation((options, callback) => {
            const mockResponse = {
                statusCode: 200,
                body: JSON.stringify([
                    {
                        time_start: "2024-01-01T12:00:00",
                        EURper_kWh: "0.15",
                        SEK_per_kWh: "1.5"
                    }
                ])
            };
            callback(null, mockResponse, mockResponse.body);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch data and process the result correctly', (done) => {
        getData('2024-01-01', config, (result) => {
            // Verify that the result has been parsed and returned as expected
            expect(result).toBeDefined();
            expect(result).toEqual([
                {
                    time_start: "2024-01-01T12:00:00",
                    EURper_kWh: "0.15",
                    SEK_per_kWh: "1.5"
                }
            ]);
            done(); // Call done to finish the async test
        });
    });
});

describe('Date Formatting Test', () => {
    it('should format the date to "YYYY/MM-DD_SE3" given a specific date', () => {
        // Set a known date to check the format
        const testDate = moment('2024-01-01');
        const formattedDate = testDate.format('YYYY[/]MM-DD[_]SE3');

        // Assert that the formatted date is as expected
        expect(formattedDate).toBe('2024/01-01_SE3');
    });
});