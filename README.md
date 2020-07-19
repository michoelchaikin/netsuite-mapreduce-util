# NetSuite Map Reduce Util

## Synopsis

A NetSuite Suitelet to aid in developing and testing Map Reduce Scripts

![Screen Shot 1](resource/screenshot.gif?raw=true 'Screenshot')

## Features

- Quick click to run a Map Reduce script
- View running M/R instances status with automatic refreshing
- View script execution logs with automatic refreshing
  all in a single screen

NOTE: this project is currently in still in proof on concept stage and should not be considered stable at all!.

## Installation

When this project is stable it will be available as a SuiteApp / Bundle. Meanwhile it needs to be installed via SDF. Releases are automatically built for each version via Github Actions.

1. Download and unzip the [latest release](https://github.com/michoelchaikin/netsuite-mapreduce-util/releases/latest)
2. Install [SuiteCloud CLI for Node.js](https://github.com/oracle/netsuite-suitecloud-sdk/tree/master/packages/node-cli)
3. Run `suitecloud account:setup`
4. Run `suitecloud project:deploy`

## Building

The project was bootstrapped using [create-spa-netsuite](https://www.npmjs.com/package/@finitydevs/create-spa-netsuite). Follow the instructions there.

## Pipeline / To Do List

### Select Deployment

- [x] Add script drop down and retrieve results for all deployments if only a script is selected
- [ ] Refresh button on deployment (and script) drop-down to reload available deployments
- [ ] Display feedback on if run button click was successful

### Instances

- [x] Sort instance stages correctly (Get Input Data, Map etc..)
- [x] Show overall status correctly (time started/ended/progress etc..)
- [ ] Show failed instances in red

### Execution Log

- [x] JSON tree viewer for the data field in logs (using something like https://www.npmjs.com/package/vue-json-tree-view)
- [ ] Option to clear logs?
- [ ] Make it clearer when new logs are added (maybe a button "Load New Logs" twitter style, or just color logs differently for first couple seconds)
- [x] Add ability to filter by log type (DEBUG, AUDIT etc..)
- [x] Add search box to filter logs

### Vue

- [x] Update to Vuetify 3 when available for fixed table headers etc..
- [x] Don't use Vue development mode for production builds
- [x] Move Vue template from the DOM (to text/x-template tags?) to hide flashing when loading
- [x] Re-factor into separate Vue components (and maybe separate .vue files with build step?)

### General

- [ ] Auto refreshing rate should be more frequent when an instance is running (maybe up to every 1 sec) and slower when not (especialy if tab is not active or in focus) (maybe add option to pause auto refresh?)
- [ ] Visual feedback when refreshing is happening
- [ ] Date range for retrieving logs/instances - instead of hard-coding to today, could either display a date range option in the UI, or retrieve the most recent n entries irrespective of date?
- [ ] Proper error checking on API calls
- [x] Add a Menu link in NetSuite
- [ ] Resize iframe container according to content size (see https://stackoverflow.com/questions/9975810 for ideas)
- [ ] Persist selected deployment on page refresh

## Usage

To open the utility, navigate to `Setup > Customization > Map Reduce Utility`.

## Author

Michoel Chaikin <[michoel@gmail.com](mailto:michoel@gmail.com)>

## License

The MIT License (MIT)

Copyright (c) 2020 Michoel Chaikin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
