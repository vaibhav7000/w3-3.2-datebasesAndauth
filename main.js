const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken");
const jwtPass = "randomPasswords"
const app = express();
const storage = [];
const port = 3000;

const userObject = z.object({
    userName: z.string().min(5),
    password: z.string().regex(/^[a-z]+$/).min(5) // regex(/^[a-z]+$/) -> this checks string only contains loweraphabets as characters with atleast 1 character
})

// backend server (http server) that will send the users from the faker apis if the request is authenticated (the client belongs to the system) else return 403 invalid access to the resources / logic /functionality

// backend server routes -> 1. signup(post) -> client enters into the system  2. signin(post) -> gets the token if the client belongs to the system 3. users(get) -> send faker apis products if the client belong to the data based on the token

// flow -> signup -> signin -> users

// user-input validation for signin and signup
function userInputValidation(req, res, next) {
    const userName = req.headers["username"]
    const password = req.headers["password"]

    const finalObject = {
        userName,
        password
    }


        // using safeParse
    const result = userObject.safeParse(finalObject);

    if(!result.success) {
        res.status(411).json({
            issues: result.error.issues,
            name: result.error.name
        })
        return
    }

    req.result = finalObject;

    next();
}

function belongsToSystem(req, res, next) {
    const userName = req.headers["username"]
    const password = req.headers["password"]
    // checking the local storage 
    const result = storage.find(user => user.userName === userName && user.password === password);
    
    if(!result) {
        res.status(411).json({
            msg: "You does not belong to the system. first signup and then come here"
        })
        return
    }

    next();
}

app.post("/signup", userInputValidation, function(req, res) {
    // after adding the user we will send the response and from frontend the user will be re-directed to the signup page
    const userName = req.headers["username"]
    const password = req.headers["password"]
    storage.push({
        userName, password
    });

    res.status(200).json({
        msg: "Congratulations for entering the system"
    })
})

// signin route-handler where the user will get token if it belongs to the system
app.post("/signin", userInputValidation, belongsToSystem, function(req, res) {
    const userName = req.headers["username"]
    const password = req.headers["password"]

    // getting the token using jsonwebtoken libray with password. either give it JSON data or js object both will be fine
    const token = jwt.sign(JSON.stringify({userName}), jwtPass);

    res.status(200).json({
        token
    })
})

// gloabl-catches
app.use(function(err, req, res, next) {
    if(err) {
        console.log(err);
        res.status(500).send("Internal server error. Something up with the backend")
        return;
    }

    next(); // not found rounte-handler will be called
})

app.use(function(req, res, next) {
    res.status(404).json({
        msg: "route-does not exist"
    })
})


app.listen(port);

// we will be using the "jsonwebtoken library" to implement the jwt (token) token is returned by doing hashing + encryption-decryption on the JSON data with some password using jsonwebtokens.sign(JSONData, password). any system can re-convert the token into the JSON data, but the system that has the original password while converting the JSON data can only verify (jsonwebtoken.verify(token, password)) it (sought of check checking machine in banks)

// verification will be successfull if the token is made from the same provided that is used in the verify method

// response.json() , response.text() -> kind of decrypting data into the original format