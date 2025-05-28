// JS runtime provides us fetch function that is use to send request / communicate with the http servers deployed on the internet and using this we can send get, post, put, delete different kind of requests. Using fetch the frontend / html pages sends request to the backend / http servers. similary the nodeJS (runtime) also provides fetch to hit other backend servers

// The request call to the server takes time => does not perform on the main thread, hence fetch follows the asynchronous approach (delegate to other thread) and returns the promise


// Authentication -> process in which we check if the user / client / request is allowed to enter to the system (in http servers authenication means checking the user if he / she can use the functionalities / logic present in the route-handler)

// For authentication we require 3 concepts 1. hashing, 2. encryption-description, 3. json web tokens (jwt)

// hashing -> in hashing ( we will use functin for this output) we convert the string into random characters such that no one can predict that orignal string and we are neverever going to convert the random characters in original string, the function always throw the same ramdom characters for the same string. and hence we do hashing we storing the password in the datebase so that no one can see those password.

// encryption and decryption -> we will use  key (string) to convert the original string into random characters (encryption) and we use the same key to convert the random characters back into the original string (decryption) this will  performed using function. if someone has the key he / she can encrpt or decrypt the data.

// jwt (used for authentication on every route) -> sort of hashing and encryption-decryption with "a password" on "JSON data" and through these we get the token (more structured string) back (called that as jwt). anyone can convert the token back into JSON data but the original password is require to verify that JSON and hence we use this for authentication

// jwt represent a "token" that is build from the JSON data + hashing encryption decryption with a password. this token can be converted to original string without password, but if we want to verfiy the token we want the password. and it will be verified if it is build using the same password as provided


// Different languages provides different functions that makes request to the backend application (fetch -> JS)
// In backend (http servers) authentication is process (function call) in which we check if the request / client / user belongs to the system ( can use the functionality present inside the route-handlers)


// Databases are the replacement for the in-house storage that we create in the backend application because if the server crashes / restarts then all the data stored will be lost

// 4 types of database 1. sql db, 2. nosql db, 3. vector db, 4. graph db

// nosql databases
// MongoDB is the implementation for the nosql database => using MongoDB to store the data
// In nosql DB there are collections / table, in collection we dump the JSON format data, it is schemaless (can dump anything in tables / collections in the JSON format)


// MongoDB provides us the clusters / machines in which we will create different nosql Databases (buckets) and we have (create)collections / tables in db where the JSON data in dump

// Know we have to "connect the backend with the database" for these we have libraries like mongoose that will do the connection, only we have to provide the connection url and password

// we can do the connection without any libraries usign nodeJS + adding, updating, deleting stuff, but these libraries provides some extra features like mongoDB validation (since it is schemaless but using mongoose we can do the validation)


// vc160222
// x8TOIKGv5jVJDlXV
