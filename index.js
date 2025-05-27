// JS runtime provides us fetch function that is use to send request / communicate with the http servers deployed on the internet and using this we can send get, post, put, delete different kind of requests. Using fetch the frontend / html pages sends request to the backend / http servers. similary the nodeJS (runtime) also provides fetch to hit other backend servers

// The request call to the server takes time => does not perform on the main thread, hence fetch follows the asynchronous approach (delegate to other thread) and returns the promise


// Authentication -> process in which we check if the user is allowed to enter to the system (in http servers authenication means checking the user if he / she can use the functionalities / logic present in the route-handler)

// For authentication we require 3 concepts 1. hashing, 2. encryption description, 3. json web tokens (jwt)

// hashing -> in hashing ( we will use functin for this output) we convert the string into random characters such that no one can predict that orignal string and we are neverever going to convert the random characters in original string, the function can always through the same ramdom characters for the same string.

// encryption and decryption -> we will use  key (string) to convert the original string into random characters (encryption) and we use the same key to convert the random characters back into the original string (decryption) this will also performed using function. if someone has the key he / she can encrpt or decrypt the data

// jwt (used for authentication on every route) -> sort of hashing and encryption-decryption with "a password" on "JSON data" and through these we get the token back (called that as jwt). anyone can convert the token back into JSON data but the original password is require to verify that JSON and hence we use this for authentication