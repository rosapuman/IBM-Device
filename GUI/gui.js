/* This code is not relevant, purely for visualisation. */
var blessed = require('blessed');
var contrib = require('blessed-contrib');
var hw = require('systeminformation');

class Chart {
  constructor(grid, type, x, y, xs, ys, config) {
    this.chart = grid.set(x, y, xs, ys, type, config);
  }
}

class LineChart extends Chart {
  constructor(grid, x, y, xs, ys, label) {
    var config = {
      label: label,
      style: {
        line: 'yellow',
        text: 'green',
        baseline: 'red'
      },
      xLabelPadding: 3,
      xPadding: 5
    };
    super(grid, contrib.line, x, y, xs, ys, config);
    this.data = {
      x: [],
      y: []
    };
  }

  async PushData(y) {
    var time = new Date();
    time = `${time.getMinutes()}:${time.getSeconds()}`;
    this.data.x.push(time);
    this.data.y.push(y);
    if (this.data.x.length > 10) {
      this.data.x.shift();
      this.data.y.shift();
    }
    this.chart.setData([this.data]);
  }
}

class MapChart extends Chart {
  constructor(grid, x, y, xs, ys, label) {
    var config = {
      label: label
    };
    super(grid, contrib.map, x, y, xs, ys, config);
    this.chart.addMarker({"lat": "59.404568", "lon": "17.950141" })
  }
}

class DeviceGUI {
  constructor() {
    this.screen = blessed.screen();
    this.grid = new contrib.grid({
      rows: 12,
      cols: 12,
      screen: this.screen
    });

    this.cpu_temp = new LineChart(this.grid, 6, 0, 3, 6, 'CPU Temp');
    this.cpu_speed = new LineChart(this.grid, 6, 6, 3, 6, 'CPU Speed');
    this.map = new MapChart(this.grid, 0, 0, 6, 12);
    this.log = this.grid.set(9, 6, 3, 6, contrib.log,
                             {
                               fg: 'green',
                               selectedFg: 'green',
                               label: 'Tranmission log'
                             });
    this.sys = this.grid.set(9, 0, 3, 6, contrib.table,
                             {
                               label: 'System Information',
                               interactive: false,
                               columnWidth: [20, 10]
                             });
    hw.cpu().then((sys) => {
      this.sys.setData({
        headers: ['', ''],
        data: [
          ['Manufacturer', sys.manufacturer],
          ['Type:', sys.brand],
          ['Cores:', sys.cores],
          ['Max Speed (Ghz):', sys.speedmax],
          ['Platform:', process.platform],
        ]
      });
    });
    this.Render();
  }

  Render() {
    this.screen.render();
  }
}

module.exports = DeviceGUI;
