# MMM-Nordic-Electrical-Spot-Prices

This is a module for [MagicMirror²](https://magicmirror.builders/) smart mirror project.

This module us for showing the current electrical spot prices in northen europe.

| Status  | Version | Date       | Maintained? |
| ------- | ------- | ---------- | ----------- |
| Working | `1.0.0` | 2022-11-05 | Yes         |

## Dependencies
- moment ^2.29.4
- request ^2.88.0

## Installation

To install the module, use your terminal to:

1. Navigate to your MagicMirror's modules folder. If you are using the default installation directory, use the command:<br />`cd ~/MagicMirror/modules`
2. Copy the module to your computer by executing the following command:<br />`git clone https://github.com/cSharpBastard/mmm-nordic-electrical-spot-prices.git`

## Using the module

### MagicMirror² Configuration

To use this module, add the following configuration block to the modules array in the `config/config.js` file:

```js
var config = {
    modules: [
        {
        ...
            module: 'mmm-nordic-electrical-spot-prices"',
            position: "top_left",
            config: {
                // See below for Configuration Options
            }
        },
        ...
    ]
}
```

### Configuration Options

| Option                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `currency`             | _Optional_ - The currency that shall be used. Valid values are: SEK, NOK, DKK, EUR<br />**type:** `string`<br />**Default:** `'SEK'`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `area`                 | _Optional_ - See http://www.nordpoolspot.com/maps/ for valid values<br />**Type:** `string`<br />**Default:** `SEK`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `updateInterval`       | _Optional_ - How often to fetch data in ms<br />**Type:** `integer`<br />**Default:** `60000`                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `title`                | _Optional_ - Title of the module<br />**type:** `string`<br />**Default:** `'Dagens priser'`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `yLegend`              | _Optional_ - Text for the Y legend<br />**Type:** `string`<br />**Default:** `'Kr / kWh'`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

## Updates

To update the module to the latest version, use your terminal to:

1. Navigate to your mmm-nordic-electrical-spot-prices folder. If you are using the default installation directory, use the command:<br />`cd ~/MagicMirror/modules/mmm-nordic-electrical-spot-prices`
2. Update the module by executing the following command:<br />`git pull`

If you have changed the module on your own, the update will fail. <br />To force an update (WARNING! your changes will be lost), reset the module and then update with the following commands:

```
git reset --hard
git pull
```
## Manually Choose a Version

To use an older version of this module, use your terminal to:

1. Navigate to your mmm-nordic-electrical-spot-prices folder. If you are using the default installation directory, use the command:<br>`cd ~/MagicMirror/modules/mmm-nordic-electrical-spot-prices`
2. Fetch all the available tags<br>`git fetch`
3. Show all the available tags<br>`git tag`
4. Checkout one of the available tags<br>`git checkout {tag_name}`<br>Example: `git checkout v1.0.0`

To switch back to the latest version, use your terminal to:

1. Navigate to your mmm-nordic-electrical-spot-prices folder. If you are using the default installation directory, use the command:<br>`cd ~/MagicMirror/modules/mmm-nordic-electrical-spot-prices`
2. Checkout the master branch<br>`git checkout master`

## License

### The MIT License (MIT)

Copyright © 2018 David Dearden

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the “Software”), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

**The software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.**
