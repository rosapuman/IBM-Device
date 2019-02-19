var blessed = require('blessed');
var contrib = require('blessed-contrib');
var hw = require('systeminformation');

screen = blessed.screen();
var grid = new contrib.grid({
  rows: 12,
  cols: 12,
  screen: screen
});

function LineChartConfig(label) {
  this.style = {
    line: "blue",
    text: "green",
    baseline: "black"
  };
  this.xLabelPadding = 3;
  this.xPadding = 5;
  this.label = label;
}

var temp_chart_config = new LineChartConfig('Temperature');
var cpu_chart_config = new LineChartConfig('CPU Speed');

var map = grid.set(0, 0, 8, 12, contrib.map, {label: 'Device Map'})
var temp_chart = grid.set(8, 0, 4, 6, contrib.line, temp_chart_config);
var speed_chart = grid.set(8, 6, 4, 6, contrib.line, cpu_chart_config);

var temp_data = {
   x: [],
   y: []
};

var speed_data = {
   x: [],
   y: []
};

temp_chart.setData([temp_data]);
speed_chart.setData([speed_data]);
map.addMarker({"lon" : "-79.0000", "lat" : "37.5000", color: "red", char: "X" })

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

setInterval(() => SendData(), 2000);
/* Send spoofed data. */
async function SendData() {
  var time = new Date();
  time = time.getMinutes().toString() + ':' + time.getSeconds().toString();
  
  hw.cpuTemperature().then(cpu_temp => {
    temp_data.x.push(time);
    temp_data.y.push(cpu_temp.main);
  });
  hw.cpuCurrentspeed().then(cpu_speed => {
    speed_data.x.push(time);
    speed_data.y.push(cpu_speed.avg);
  });

  temp_chart.setData([temp_data]);
  speed_chart.setData([speed_data]);
  screen.render();
}

screen.render();

