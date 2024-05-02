"use strict";
const mongoose =  require("mongoose");
const env  = require("../config/env"); 

module.exports.connect = ()=>{
    const dbName = env.db.name;
    const url = `${env.db.url}`;
    mongoose.set("debug", env.debug_mongo);    

    /*connect mongoDB*/
    mongoose.connect(
        url, {
            useNewUrlParser: true
        }
    );

    /*if database connected successfully*/
    mongoose.connection.on("connected", (err, result) => {
        console.log(`Successfully connected to DB: ${dbName}`);
    });

    /*if unable to connect to DB*/
    mongoose.connection.on("error", err => {
        console.log(`Failed to connect to DB: ${dbName}, ${err}`);
    });

    /*if connection has been break due to any reason*/
    mongoose.connection.on("disconnected", err => {
        console.log(`Default connection to DB: ${dbName} disconnected`);
    });
}


