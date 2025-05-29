// using express + zod (user-validation) + mongoose (for communication with the mongoDB noSQL database (which is present on the machine / cluster whose url mongoDB provides)) to make a http server

// we have to provide mongoose the the cluster url + database which will be whole present in the url
const express = require("express");
const app = express();
const z = require("zod");
const mongoose = require("mongoose");

const connection_url = "mongodb+srv://vc160222:x8TOIKGv5jVJDlXV@weekthreepoint2database.tjr09d4.mongodb.net/"; // url for the cluster / machine provided by mongoDB where we can create multiple noSQL databases
const dataBaseName = "user"

const finalConnection = `${connection_url}/${dataBaseName}`;
async function connection() {
    // connection takes time => will be asynchronously done on other thread, but if the connection fails stop the process
    try {
        const response = await mongoose.connect(finalConnection);
        console.log("success")
    } catch(err) {
        // stop the process
        console.log(err);
        process.exit(1) // this number can be seen in the terminal and hence we can detect the error using this code
    }
}
connection();

// providing the structure of Data using Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String
})

// Through schema we will define models (kind of class) that will be used to construct object
const user = new mongoose.model("User", userSchema); // created a model with name "User" -> which mongoose will use to do the CRUD on "User" colllection which will be created if not present, hence it also represents the collection-name. Mongoose will pluralize it and make it lowercase

// this model will be used to create objects that will be stored in the databse
const endUser1 = new user({
    username: "Vaibhav",
    password: "pass"
})


app.get("/user", function(req, res) {
    res.status(200).send("welcome to the http server")
})


// mongoose provides us connection object with respect to mongoose.connect() connection, this object has eventListner related to the connection like error
const dbConnection = mongoose.connection;

app.listen(3000);


// Databases are the replacement for the in-house-storage that we used in our application. if the application restart we will lost the data
// noSQL database has collection / tables where the JSON form data will be dumped.
// MongoDB provides the noSQL database. It provides us the cluster / machine (we can access through the URL) where we can create different database (noSQL). There will be different collections / tables present in the database where we store the data in the form of JSON. noSQL database always store the data in JSON form. 

// we can directly do the CRUD operations using the nodeJS on the mongoDB (noSQL database), but since noSQL databases are schemaless (can store any JSON data), we will use library called "mongoose" that will help to store the data in valid schema. 

// "Mongoose" will be used to connect to the database + provides some validation methods before storing the data in the noSQL database
