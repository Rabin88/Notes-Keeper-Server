const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use (bodyParser.json());
app.use(express.static("public"));
app.use(cors());


// connecting to MongoDB
let mongoUser = process.env.Username;
let mongoPass = encodeURIComponent(process.env.Password);
// let mongoUser = 'rabin';
// let mongoPass = encodeURIComponent('Thames@09');
let connectionStr = `mongodb+srv://${mongoUser}:${mongoPass}@cluster0-yazdi.mongodb.net/notesDB?retryWrites=true&w=majority`; 
mongoose.connect(connectionStr, {useNewUrlParser: true });

// Note Schema for Database
const noteSchema = {
    title: {type: String},
    content: {type: String}
}
// Export Note Module
const Note = mongoose.model("Note", noteSchema)

// POST route to save Note in Database
app.route("/notes")
.post(function(req, res){

   // console.log(req.body.titl);
   // console.log(req.body.cont);

	//Create new Note received from the client, the req.body will contain the client data
	const newNote = new Note({
      title: req.body.titl,
      content: req.body.cont
   });
		
	//New Note will be saved into the database
   newNote.save(function(err){
      if(!err){
         res.send({message:"Success"})
      } else {
         res.send(err);
      }
   });
});

// GET route to get all the Notes from the database
app.route("/notes")
.get(function (req, res){
    Note.find(function(err, foundArticles){
      if(!err){
      	res.json(foundArticles)
      }
      
   })
});

//DELETE,PUT, PATCH Specific notes

app.route("/notes/:noteTitle")
.delete(function(req,res){
  	Note.deleteOne(
    	{title:req.params.noteTitle},
      	function(err){
        		if(!err){
          	res.send("Successfully Deleted")
        	} else {
          	res.send(err)
        	}
    	}
  	)
});

app.route("/notes/:noteTitle")
.put(function(req,res){
    
   Note.update(
      {title:req.params.noteTitle},
      {title:req.body.titl, content: req.body.cont},
      {overwitre: true},
      function(err){
         if(!err){
            res.send({message:"Successfully Updated PUT request"})
         } else {
            res.send(err)
         }
      }
   )
});

app.route("/notes/:noteTitle")
.patch(function(req,res){
    
   Note.updateOne(
      {title:req.params.noteTitle},
      {$set: {title:req.body.titl, content: req.body.cont}},
      // {$set: req.body},
      function(err){
         if(!err){
            res.send({message:"Successfully Updated PATCH request"})
         } else {
            res.send(err)
         }
      }
   )
});

// GET Specific routes
// app.route("/articles/:articleTitle")
// .get(function(req, res){
    
//     Article.findOne({title: req.params.articleTitle},function(err, foundArticle){
//         if(foundArticle){
//             res.send(foundArticle);
//         } else {
//             res.send("Article not found");
//         }
//     });
// })



//Listening to the server PORT
// app.listen(4000, function() {
//    console.log("Server started on port 4000")
// })

function normalizePort(val) {
	var port = parseInt(val, 10);
 
	if (isNaN(port)) {
	  // named pipe
	  return val;
	}
 
	if (port >= 0) {
	  // port number
	  return port;
	}
 
	return false;
 }

 var port = normalizePort(process.env.PORT || 6000);

 app.listen(port, function(){
	console.log(`Server is running on port ${port}`);
 })


// app.listen(process.env.PORT || 5000, function(){
//   console.log("Server is running on localhost 5000");
// })