var iotf = require('ibmiotf');
class Device {
  constructor(org, token) {
    const device_config = {
      "org": org,
      "domain": "internetofthings.ibmcloud.com",
      "type": "IBM-KTH",
      "id": "0",
      "auth-method": "token",
      "auth-token": token,
      "use-client-certs": false
    };
    this.device = new iotf.IotfManagedDevice(device_config);
    this._setup();
  }
  
  Push(id, data) {
    this.device.publishHTTPS(id, 'json', JSON.stringify(data), 0);
  }
  
  _setup() {
    var that = this;
    /* Setting the log level to debug. By default its 'warn' */
    //this.device.log.setLevel('debug');
    
    /* Connect it to Watson IoT! */
    this.device.connect();

    /* When your device has connected, setup listeners and callbacks. */
    this.device.on('connect', function(parent){
      that.device_connected = true;
	    var rc = that.device.manage(3600, true, true);
      
      that.device.on('dmAction', function(request){
        console.log('Action : ' + request.action);
        that.device.respondDeviceAction(request,
                                        that.device.RESPONSECODE.FUNCTION_NOT_SUPPORTED, 
                                        "Function not supported");
      });
      
      /* If the device disconnects, we do not need to panic. */
      that.device.on('disconnect', function(){
        that.device_connected = false;
        console.log('Disocnnected');
      });
      
      /* Errors are pretty bad, right? */
      that.device.on('error', function (argument) {
        console.log(argument);
        process.exit(1);
      });
      
      /* Update the device location, long-lat. */
      that.device.updateLocation(17.950141, 59.404568);
    });
  }
  
  IsConnected() {
    return this.device_connected;
  }
}

module.exports = Device;


