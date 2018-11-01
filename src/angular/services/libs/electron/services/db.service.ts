import { Injectable } from '@angular/core';
var dbObj = window['System']._nodeRequire('./backend/dbapi/AppDB');

@Injectable()
export class dbService{
    public dbclass:any;

    public getDevice = function () {
        var _this = this;
        return new Promise((resolve, reject) => {
            return _this.dbclass.getDevice( function (doc) {
                resolve(doc);
            });
        });
    }

    public getDevice2 = function () {
        var _this = this;
        return new Promise((resolve, reject) => {
            return _this.dbclass.getDevice2().then((data:any)=>{
                resolve(data);
            })
        });
    }

    public getProfile = function (obj) {
        var _this = this;
        return new Promise((resolve, reject) => {
            return _this.dbclass.getProfile(obj).then((data:any)=>{
                resolve(data);
            })
        });
    }

    public getAllProfile = function () {
        var _this = this;
        return new Promise((resolve, reject) => {
            return _this.dbclass.getAllProfile().then((data:any)=>{
                resolve(data);
            })
        });
    }

    public AddProfile = function (obj) {
        var _this = this;
        return new Promise((resolve, reject) => {
            return _this.dbclass.AddProfile(obj).then((data:any)=>{
                resolve(data);
            })
        });
    }

    public UpdateProfile = function (id,obj) {
        var _this = this;
        return new Promise((resolve, reject) => {
            return _this.dbclass.UpdateProfile(id,obj).then((data:any)=>{
                resolve(data);
            })
        });
    }

    public DeleteProfile = function (id) {
        var _this = this;
        return new Promise((resolve, reject) => {
            return _this.dbclass.DeleteProfile(id).then((data:any)=>{
                resolve(data);
            })
        });
    }

    constructor(){
        var _this = this;
        this.dbclass = new dbObj.AppDB();
    }

}