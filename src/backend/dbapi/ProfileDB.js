var db = require('./DB'); 
var env = require('../others/env');
var ProfileDB = (function (){
    var _this; 
    function ProfileDB() {
      	_this = this;
        _this.DB =new db.DB(); 
    }

    ProfileDB.prototype.getProfile = function(obj){
        return new Promise(function (resolve, reject) {
            return  _this.DB.queryCmd('Profile',obj,function(docs){  
                resolve(docs);     
            });  
        });
    };

    ProfileDB.prototype.getAllProfile = function(){
        return new Promise(function (resolve, reject) {
            return  _this.DB.queryCmd('Profile',{},function(docs){  
                resolve(docs);     
            });  
        });
    };

    ProfileDB.prototype.AddProfile = function(obj){
        return new Promise(function (resolve, reject) {
            return  _this.DB.insertCmd('Profile',obj,function(docs){  
                resolve(docs);     
            });  
        });
    };

    ProfileDB.prototype.UpdateProfile = function(id, obj){
        return new Promise(function (resolve, reject) {
            var data={id:id}
            return  _this.DB.updateCmd('Profile',data,obj,function(docs){  
                resolve(docs);     
            });  
        });
    };

    ProfileDB.prototype.DeleteProfile = function(id){
        return new Promise(function (resolve, reject) {
            var obj = {id:parseInt(id)};
            return  _this.DB.deleteCmd('Profile',obj,function(docs){  
                resolve(docs);     
            });  
        });
    };

    ProfileDB.prototype.DB = undefined;  
  
    return ProfileDB;  

})()

exports.ProfileDB = ProfileDB;