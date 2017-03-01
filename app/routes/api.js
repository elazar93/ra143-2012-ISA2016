
var User = require('../models/user'); // Important the database User Model created with Mongoose Schema
var jwt = require('jsonwebtoken');
var secret ="harrypotter";
var nodemailer = require('nodemailer'); // Import Nodemailer Package
var sgTransport = require('nodemailer-sendgrid-transport'); // Import Nodemailer Sengrid Transport Package



// Export routes to the main server.js file
module.exports = function(router) {
    /* ====================
    User Registration Route
        ==================== */


    var options = {
        auth: {
            api_user: 'straja', // Sendgrid username
            api_key: 'l1o8t712' // Sendgrid password
        }
     }
    var client = nodemailer.createTransport(sgTransport(options));

    router.post('/users', function(req, res) {
        var user = new User(); // Create a new User object and save to a variable
        user.username = req.body.username; // Save username sent by request (using bodyParser)
        user.password = req.body.password; // Save password sent by request (using bodyParser)
        user.email = req.body.email; // Save email sent by request (using bodyParser)
        user.temporarytoken = jwt.sign({  username: user.username, email: user.email
                },secret,{expiresIn: '24h'});

        // If statement to ensure request it not empty or null

        if (req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '') {
            res.json({ success: false, message: 'Ensure username, email, and password were provided' });
        } else {
            // If criteria is met, save user to database
            user.save(function(err) {
                if (err) {
                    res.json({ success: false, message: 'Username or Email already exists!' }); // Cannot save if username or email exist in the database
                } else {

                        var email = {
                        from: 'Localhost Staff, staff@localhost.com',
                        to: user.email,
                        subject: 'Localhost Activation Link',
                        text: 'Hello ' + user.username + ', thank you for registering at localhost.com. Please click on the following link to complete your activation: http://localhost:8081/activate/' + user.temporarytoken,
                        html: 'Hello<strong> ' + user.username + '</strong>,<br><br>Thank you for registering at localhost.com. Please click on the link below to complete your activation:<br><br><a href="http://localhost:8081/activate/' + user.temporarytoken + '">http://localhost:8081/activate/</a>'
                    };
                    // Function to send e-mail to the user
                    client.sendMail(email, function(err, info) {
                        if (err) console.log(err); // If error with sending e-mail, log to console/terminal
                    });



                    res.json({ success: true, message: 'Account registered, please check your email link!' }); // If all criteria met, save user
                }
            });
        }
    });

    //USER LOGIN ROUTE
    //localhost:8081/api/authenticate
    router.post('/authenticate',function(req,res){

       User.findOne({ username: req.body.username}).select('email username password active').exec(function(err,user){

        if (err) throw err;
        

        if(!user){
           
            res.json({success: false, message: 'could not authenticate user'});

        } else if (user){

            if(req.body.password){
                var validPassword = user.comparePassword(req.body.password);
            }else{
                res.json({success:false,message:'no password provided'});
            }

            if(!validPassword){
                res.json({success:false , message: 'Could not authenticate password'});
            } 
             else{
               var token = jwt.sign({
                    username: user.username, email: user.email
                },secret,{expiresIn: '24h'});
                res.json({success:true, message: 'user logged in', token: token});
            }
        }

       });

    });


    router.put('/activate/:token', function(req,res){

        User.findOne({ temporarytoken: req.params.token }, function(err, user) {
            if (err) throw err; // Throw error if cannot login
            var token = req.params.token; // Save the token from URL for verification 
            
            // Function to verify the user's token
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Activation link has expired.' }); // Token is expired
                } else if (!user) {
                    res.json({ success: false, message: 'Activation link has expired.' }); // Token may be valid but does not match any user in the database
                } else {
                    user.temporarytoken = false; // Remove temporary token
                    user.active = true; // Change account status to Activated
                    // Mongoose Method to save user into the database
                    user.save(function(err) {
                        if (err) {
                            console.log(err); // If unable to save user, log error info to console/terminal
                        } else {
                            // If save succeeds, create e-mail object
                            var email = {
                                from: 'Localhost Staff, staff@localhost.com',
                                to: user.email,
                                subject: 'Localhost Account Activated',
                                text: 'Hello ' + user.name + ', Your account has been successfully activated!',
                                html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Your account has been successfully activated!'
                            };

                            // Send e-mail object to user
                            client.sendMail(email, function(err, info) {
                                if (err) console.log(err); // If unable to send e-mail, log error info to console/terminal
                            });
                            res.json({ success: true, message: 'Account activated!' }); // Return success message to controller
                        }
                    });
                }
            });
        });
    });

    router.use(function(req,res,next){

        var token = req.body.token || req.body.query || req.headers['x-access-token'];


    if (token) {
            // Function to verify token
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Token invalid' }); // Token has expired or is invalid
                } else {
                    req.decoded = decoded; // Assign to req. variable to be able to use it in next() route ('/me' route)
                    next(); // Required to leave middleware
                }
            });
        } else {
            res.json({ success: false, message: 'No token provided' }); // Return error if no token was provided in the request
        }
    });



    router.post('/me',function(req,res){

        res.send(req.decoded);
    });

    router.get('/friends',function(req,res){
        User.find({},function(err,users){
            if(err) throw err;

            res.json({success: true, users: users});

        })

    });

    router.delete('/friends/:username', function(req,res){
        var deletedUser =req.params.username;
        User.findOne({ username: req.decoded.username}, function(err,mainUser){
            if(err) throw err;

            User.findOneAndRemove({username: deletedUser},function(err,user){
                if(err) throw err;
                res.json({success: true});
                console.log('uspelo');

            });

        });

    });


    return router; // Return router object to server

}




