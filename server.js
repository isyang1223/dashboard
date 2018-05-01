// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');

// exports.index = function (req, res) {
//     res.render('index', { moment: moment });
// }
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/basic_mongoose');
mongoose.Promise = global.Promise;


var PandaSchema = new mongoose.Schema({
    name: { type: String, required: [true, "name needs to be at least 2 character"], minlength: 2 },
    panda: { type: String, required: [true, "panda needs to be at least a character"], minlength: 1 },
}, { timestamps: true });


// var UserSchema = new mongoose.Schema({
//     name: String,
//     age: Number
// })
mongoose.model('Panda', PandaSchema); // We are setting this Schema in our Models as 'User'
var Panda = mongoose.model('Panda') // We are retrieving this Schema from our Models, named 'User'



// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request


app.get('/pandas/edit/:id', function (req, res) {
    Panda.findOne({ _id: req.params.id }, function (err, panda) {
        if (err) {
            console.log('error1231')
        }
        else {
            console.log(panda)
            res.render('edit', { panda: panda });
        }
    })
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering


})
// app.get('/', function (req, res) {
//     // This is where we will retrieve the users from the database and include them in the view page we will be rendering
//     res.render('index');
// })
// // Add User Request 
app.get('/', function (req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    Panda.find({}, function (err, pandas) {
        if (err) {
            console.log(err)
        }
        else {
            console.log(pandas)
            res.render('index', { pandas: pandas});
        }
    })
})
app.get('/pandas/new', function (req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
 
            res.render('new');

})
app.post('/pandas', function (req, res) {
    console.log("POST DATA", req.body);
    // create a new User with the name and age corresponding to those from req.body
    var panda = new Panda();
    panda.name = req.body.name
    panda.panda = req.body.panda


    // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    panda.save(function (err) {
        // if there is an error console.log that something went wrong!
        if (err) {
            console.log('something went wrong!!!');
            res.render('new', { errors: panda.errors })
        }

        else { // else console.log that we did well and then redirect to the root route
            console.log('successfully added a panda!');
            res.redirect('/');
        }
    })
})

app.post('/pandas/:id', function (req, res) {
    console.log("POST DATA", req.body);
    Panda.findOne({ _id: req.params.id }, function (err, panda){
        panda.name = req.body.name
        panda.panda = req.body.panda
        panda.save(function (err) {
            // if there is an error console.log that something went wrong!
            if (err) {
                console.log('something went wrong!!!');

                res.render('edit', { errors: panda.errors, panda: panda})
            }

            else { // else console.log that we did well and then redirect to the root route
                console.log('successfully added a panda!');
                res.redirect('/');
            }
        })

    })
})

app.post('/pandas/destroy/:id', function (req, res) {

    console.log("POST DATA", req.params.id);
    Panda.remove({ _id: req.params.id }, function (err) {
        
       
            // if there is an error console.log that something went wrong!
            if (err) {
                console.log(err);

                
            }

            else { // else console.log that we did well and then redirect to the root route
        
                res.redirect('/');
            }




    })
})
app.get('/pandas/:id', function (req, res) {
    Panda.find({ _id: req.params.id }, function (err, pandas) {
        if (err) {
            console.log('error')
        }
        else {
            console.log(pandas)
            res.render('show', { pandas: pandas });
        }
    })
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering


})
// Setting our Server to Listen on Port: 8000
app.listen(8000, function () {
    console.log("listening on port 8000");
})