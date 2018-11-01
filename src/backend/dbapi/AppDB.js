
var env = require('../others/env');
var DeviceObj = require('./DeviceDB'); 
var ProfileObj = require('./ProfileDB'); 

var AppDB = (function (){
  var _this; 
  function AppDB() {
      	_this = this;
        _this.DeviceDB = new DeviceObj.DeviceDB();
        _this.ProfileDB = new ProfileObj.ProfileDB();
   }   

    AppDB.prototype.getDevice = function(callback){
        _this.DeviceDB.getDevice(function(data){
            callback(data)
        });
    }; 

    AppDB.prototype.insertDevice = function(callback){
        _this.DeviceDB.insertDevice(function(data){
            callback(data)
        });
    }; 

    AppDB.prototype.getDevice2 = function(){
        return new Promise(function (resolve, reject) {
            return _this.DeviceDB.getDevice2().then(function(data){
                resolve(data);
            });
        });
    }; 

    AppDB.prototype.updateDevice = function(_id, obj){
        return new Promise(function (resolve, reject) {
            return _this.DeviceDB.updateDevice(_id, obj).then(function(data){
                resolve(data);
            });
        });
    }; 

    AppDB.prototype.getProfile = function(obj){
        return new Promise(function (resolve, reject) {
            return _this.ProfileDB.getProfile(obj).then(function(data){
                resolve(data);
            });
        });
    }; 

    AppDB.prototype.getAllProfile = function(){
        return new Promise(function (resolve, reject) {
            return _this.ProfileDB.getAllProfile().then(function(data){
                resolve(data);
            });
        });
    }; 

    AppDB.prototype.AddProfile = function(obj){
        return new Promise(function (resolve, reject) {
            return _this.ProfileDB.AddProfile(obj).then(function(data){
                resolve(data);
            });
        });
    }; 

    AppDB.prototype.UpdateProfile = function(id, obj){
        return new Promise(function (resolve, reject) {
            return _this.ProfileDB.UpdateProfile(id, obj).then(function(data){
                resolve(data);
            });
        });
    }; 

    AppDB.prototype.DeleteProfile = function(id){
        return new Promise(function (resolve, reject) {
            return _this.ProfileDB.DeleteProfile(id).then(function(data){
                resolve(data);
            });
        });
    }; 


    AppDB.prototype.DeviceDB = undefined;
    AppDB.prototype.ProfileDB = undefined;

    return AppDB;  

})()

exports.AppDB = AppDB;