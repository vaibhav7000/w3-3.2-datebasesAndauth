const express = require("express");
const app = express();
const z = require("zod");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const connection_url = "mongodb+srv://vc160222:x8TOIKGv5jVJDlXV@weekthreepoint2database.tjr09d4.mongodb.net/todo_user"; // this will create noSQL database in the cluster (whose url is provided) with name todo_user if not exists

async function connection() {
    try {
    const connection = await mongoose.connect(connection_url); // this returns promise which means this is asynchronous call will be delegated to other thread
    console.log("connection success http server is connected with the database")
    } catch(err) {
        console.log("error occurs in the connection url");
        process.exit(1);
    }
}
connection(); // this also returns promise

// In mongoose we defined everything from Schema -> Model -> documents / object
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String
})

const User = new mongoose.model('User', userSchema); // 'User' / 'users' (plural and lowercase done by the mongoose) -> represent the collection / table where the objects / documents will be stored for this schema (all this is done by mongoose)

// zod validation
const userInput = z.object({
    username: z.string().min(3).max(10).regex(/^[a-z]+$/), // this reprsent string only contains lower-alphabets no empty string accepted
    password: z.string().min(5).max(15),
    email: z.string().email(), // user must provide valid email id
});

app.use(express.json()); // will convert the body if passed JSON else throw error

function userRequestValidation(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email

    // using safeParse
    const result = userInput.safeParse({
        username, password, email
    })

    if(!result.success) {
        res.status(411).json({
            issues: result.error.issues,
            name: result.error.name
        })
        return
    }

    // if success we will get data as result.data

    next();
}

app.post("/signup", userRequestValidation, async function(req, res) {
    // nodeJS / express converts the properties coming in headers automatically to lowercase by-default
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    // validation is done
    // Now store the data in the database by creating the documents / objects from model

    const user = new User({
        username, password, email
    }) // mongoose object 

    // saving the object in the database is asynchronous task
    try {
        const response = await user.save(); // return us back the stored objec
        console.log(response);

        res.status(200).json({
            msg: "User added in database"
        })
    } catch(error) {
        throw error; // will be thrown in the global catches
    }
})



app.listen(3000);



// when we does not provide any route to the middlewares -> it matches with all request but the request should be able to reach to this middle-ware handler, mean it should not match with the above

// global catches -> Using this we are not exposing the errors to the end-users / clients
app.use(function(err, req, res, next) {
    if(err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal Server error"
        })
        return
    }
    next();
})


// route-not-found route handler
app.use(function(req, res, next) {
    res.status(404).json({
        msg: "Route not found"
    })
})




// creating an http server