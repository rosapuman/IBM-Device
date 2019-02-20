var GUI = require('./GUI/gui.js');
var hw = require('systeminformation');
var IoTDevice = require ('./device/device.js');
var cfenv = require('cfenv');
var GUI_ctrl = new GUI();

var app_env = cfenv.getAppEnv({vcapFile: 'KTH-Demo_vcap.json'});
var credentials = app_env.getServiceCreds("Internet of Things Platform-bd");
var device = new IoTDevice(credentials.org, process.env.device);

setInterval(() => Transmit(), 3000);
async function Transmit() {
  var that = this;
  var temp, speed;

  await hw.cpuTemperature().then(cpu_temp => {
    that.temp = cpu_temp.main;
    GUI_ctrl.cpu_temp.PushData(that.temp);
  }).catch();
  await hw.cpuCurrentspeed().then(cpu_speed => {
    that.speed = cpu_speed.avg;
    GUI_ctrl.cpu_speed.PushData(that.speed);
  }).catch();

  /* 
   * This pushes / publishes data to Watson IoT, check device/device.js for
   * more details!
   */
  device.Push('cpu_temp', {temp: this.temp, speed: this.speed});
  GUI_ctrl.log.log(`Transmitted: ${this.temp} temp, ${this.speed} Ghz!`);
  GUI_ctrl.Render();
}
GUI_ctrl.log.log(`Initialized!`);
