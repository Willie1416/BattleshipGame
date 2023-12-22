
// Author: William Hall
// Description: This database manager demonstrates the use of database operations including creating/deleting collections and inserting, searching and updating entries.

var MongoClient = require('mongodb').MongoClient;
const config = require('./config.json');

const mycollection = config.mycollection;
const myDB = config.myDB;
const url = "mongodb+srv://"+config.username+":" + config.pwd +"@cluster0.yjzs4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// Set up the database
exports.setup = function () {
    let cbackfunc;
    createdb(cbackfunc);
    createcl(cbackfunc);
};

// Create the database
let createdb = function (callbackFn) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        console.log("Database created!");
        db.close();
    });
};

// Create the collection
let createcl = function (callbackFn) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        if (!myDB) {
          console.log("ERROR: Collection undefind. Fix myDB in config file");
          return;
        } 
        var dbo = db.db(myDB);
        dbo.createCollection(mycollection, function (err, res) {
            if (err) throw err;
            console.log("Collection created!");
            db.close();
        });
    });
};

// Inserts a unique username into the database
exports.insertUsername = function (myobj) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db(myDB);
        // Check if username exists
        dbo.collection(mycollection).findOne(myobj, function(err, res){
            if(err) throw err;
            if (res){
                db.close(); // Close database if username exists
            }
            else{
                // Insert the new username
                dbo.collection(mycollection).insertOne(myobj, function (err, res) {
                    if (err) throw err;
                    console.log("username inserted");
                    db.close();
                });
            }
        });
    });
};

// Inserts a new score for a user or updates to a better score
exports.insertScore = function (username, score) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err){
            throw err;
        }
        var dbo = db.db(myDB);
        //check if user exists already
        dbo.collection(mycollection).findOne(username, function (err, result) {
            if (err){
                throw err;
            }
            //if not insert new username
            if (result == null){
                dbo.collection(mycollection).insertOne(username, function (err, res){
                    if (err) throw err;
                    //updates new username score
                    dbo.collection(mycollection).updateOne(username, {$set: score}, function (err, res){
                        if (err) throw err;
                        console.log('new user and score inserted');
                        db.close();
                    });
                })
            }
            //updates exisitng user score if they do not have it already
            else if (result.score === undefined){
                dbo.collection(mycollection).updateOne(username, {$set: score}, function(err, res){
                    if (err) throw err;
                    console.log('score updated for old user');
                    db.close();
                });
            }
            //check if new score is better than old score. Updates if new score is better
            else if (result.score > score.score){
                dbo.collection(mycollection).updateOne(username, {$set: score}, function(err, res){
                    if (err) throw err;
                    console.log('better score updated for old user');
                    db.close();
                });
            }
            else{
                db.close();
            }

        });
    });
};

// Find all records using a limit (if limit is 0 all records are returned)
exports.findAll = function (limit,callbackFn) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db(myDB);
        // finds all records with the lowest score being the first to get the user with lowest amount of clicks
        dbo.collection(mycollection).find({score: {$exists: true}}).sort({score: 1}).limit(limit).toArray(function (err, result) {
            if (err) throw err;
            callbackFn(result); // callback function that returns the highscores
            db.close();
        });
    });
};

// Delete a collection
exports.deleteCollection = function (callbackFn) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db(myDB);
        dbo.collection(mycollection).drop(function (err, delOK) {
            if (err) throw err;
            if (delOK)
                console.log("Collection deleted");
            db.close();
        });
    });
};

