const express = require("express");
const app = express();
const z = require("zod");
const jwt = require("jsonwebtoken");
const jwtPass = "random123"; // secret
const mongoose = require("mongoose");
const connection_url = "mongodb+srv://vc160222:x8TOIKGv5jVJDlXV@weekthreepoint2database.tjr09d4.mongodb.net/todo_user"; // secret  // this will create noSQL database in the cluster (whose url is provided) with name todo_user if not exists

// our application will have unique username for the users

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

// checking in db user exist or not
async function checkUserExist(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    // this will query the db and find all the elements with username and password and email

    try {
        // since have unqiue user name inside the db we will use findOne
        const response = await User.findOne({
            username, password, email
        }) // do not need to pass all properties we can do searching with one property too

        console.log(response);

        if(!response) {
            // response -> null
            res.status(411).json({
                msg: "username, email, or password are incorrects"
            })
        }

        next();
    } catch(err) {
        throw err;
    }


}

async function sameUserNameOrEmailExistInDB(req, res, next) {
    const username = req.body.username;
    const email = req.body.email;

    // Using the findOne method because in our Db we will have unique username
    try {
        const result = await User.findOne({
            username
        });

        if(result) {
            // username already exist 
            res.status(411).json({
                msg: "username already exist in our database"
            })
            return
        }
    } catch(err) {
        throw err
    }

    // checking email exist
    try {
        const result = User.findOne({
            email
        });

        if(result) {
            res.status(411).json({
                msg: "This email already exist in our database"
            })
            return
        }

    } catch(err) {
        throw err;
    }

    next();
}

function verfiyJWT(req, res, next) {
    const token = req.headers["token"];

    try {
        const verification = jwt.verify(token, jwtPass); // if error will throw hence use try catch, else provides us the JSON data in valid format
        console.log(verification);
        req.body.user = verification;
        next();
    } catch(err) {
        res.status(411).json({
            msg: "You are not authenticated to use this route"
        })
    }
}

app.post("/signup", userRequestValidation, sameUserNameOrEmailExistInDB ,async function(req, res) {
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

// signin route and provide it the valid jwt (token) -> provides us accessing the route-handler without password, if token is leaked you will be in trouble because any can send the request using this

// if jwtPassword is leaked -> anyone Can "Generate Valid Tokens" because they know the secret and know they have to make jwt tokens using that password

// when hitting the backend they will be sending the fake token (but valid) since they are created using the orignal password and hence we can access the logic
app.post("/signin", userRequestValidation, checkUserExist ,function(req, res) {
    const username = req.body.username;
    const email = req.body.email;

    // consider jwtpassword as stamp
    // everyone has that system
    // if my stamp is exposed the other can make fake tokens using the stamp and then send tokens to the real application and since token is made from the original stamp the system will pass it

    const token = jwt.sign(JSON.stringify({
        username,
        email
    }), jwtPass);

    res.status(200).json({
        token
    })
})

// We have created the login and signup flow for the user
// creating the todo logic and storing it in the noSQL database

// todo schema using mongoose
const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    completed: Boolean,
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User' // this represents the Model name to which we want to ref
    }
})

// Everything in the mongoose is derived from Schema (structure) -> then creating models (kind of class) through which we will create documents / objects
const Todo = new mongoose.model('Todo', todoSchema) // created the Model and the string passed to it represent the collection in the mongoDB where the data will be stored in the JSON format

// zod with todo
const todoInputValidator = z.object({
    title: z.string(),
    description: z.string(),
    completed: z.boolean()
})

function todoInputValidation(req, res, next) {
    const todo = req.body.todo;

    const result = todoInputValidator.safeParse(todo);

    if(!result.success) {
        res.status(411).json({
            issues: result.error.issues,
            name: result.error.name
        })
    }

    next();
}

app.post("/todos", verfiyJWT, todoInputValidation, async function(req, res) {
    const user = req.body.user; // these we get from jwt verification
    const todo = req.body.todo;

    // if the jwt is verified than it will belong to our system

    // after doing all the validation know store the todo to the database
    // When storing the todo, that todo belongs to the User and there will be one to many relationship between (user and todo) and hence we will add a extra property on the many side (todo-side) (so that it will refer to the user). This is provided by special type provided by mongoose

    // first get the user so that linking would be done
    try {
        const dbUser = await User.findOne({
            username: user.username,
            email: user.email
        })

        if(!dbUser) {
            res.status(403).json({
                msg: "You does not exist in the DB, and you already have verified jwt 😱"
            })

            return;
        }

        const finalTodo = new Todo({
            ...todo, 
            owner: dbUser._id, // added by the mongoDB for every document / JSON for identification
        });

        try {
            const response = await finalTodo.save();

            console.log(response);

            res.status(200).json({
                msg: "your todo is added"
            })
        } catch(err) {
            throw err;
        }
    } catch(err) {
        throw err;
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

// jsonWebToken is implementation of jwt -> which represents a system that takes JSON data convert it into structured string using hasing + encryption + decryption + password such that we can convert them but the whose has the password can only verify the token