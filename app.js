var GUI = require('./GUI/gui.js');
var hw = require('systeminformation');
var IoTDevice = require ('./device/device.js');
var cfenv = require('cfenv');
var GUI_ctrl = new GUI();

/* Edit these lines to reflect your IoT platform config. */
const ORG_ID = "yk7g3z";
const ACCESS_TOKEN = "my-secret-token";
var device = new IoTDevice(ORG_ID, ACCESS_TOKEN);

setInterval(() => Transmit(), 3000);
function Transmit() {
  var that = this;
  var temp = 0;
  var speed = 0;

  hw.cpuTemperature().then(cpu_temp => {
    that.temp = cpu_temp.main;
    GUI_ctrl.cpu_temp.PushData(that.temp);
  }).catch();
  hw.cpuCurrentspeed().then(cpu_speed => {
    that.speed = cpu_speed.avg;
    GUI_ctrl.cpu_speed.PushData(that.speed);
  }).catch();

  /* 
   * This pushes / publishes data to Watson IoT, check device/device.js for
   * more details!
   */
  device.Push('device_data', {temp: this.temp, speed: this.speed});
  
  /* *** */
  GUI_ctrl.log.log(`Transmitted: ${this.temp} temp, ${this.speed} Ghz!`);
  GUI_ctrl.Render();
}

GUI_ctrl.log.log(`Initialized!`);
