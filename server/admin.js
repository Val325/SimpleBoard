const express = require('express')
const cors = require("cors")
const app = express()
const jsonParser = express.json()
const session = require('express-session')
const bodyParser = require('body-parser');
const fs = require('fs-extra')

//
// Hashing
//

const bcrypt = require('bcrypt');
const salt = 10;
require('dotenv').config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cors({
        origin: 'http://localhost:3000',
        credentials: false,
    }))


//-------------//
// Admin panel //
//-------------//

module.exports.admin = (app, dbIn, collectionIn) => {
	let sessions = false;

	app.use(bodyParser.json());

	app.use(session({
	  secret: 'keyboardCat777',
	  resave: false,
	  saveUninitialized: true,
	  cookie: { secure: true, maxAge: 60000 },
	}))

	//--------------//
	// Registration //
	//--------------//
	app.post('/adminData', jsonParser, function (request, response, next) {
		console.log("Admin panel working!")
		try {
			dbIn.connect().then(Client => {
				const db = dbIn.db("AdminsAndModerators")
    			const collection = db.collection(collectionIn)

    			collection.count().then((count) => {

        			bcrypt.hash(request.body.Password, salt, function(err, hash) {
						const posts = {
							id: `${count}`,
							Email: `${request.body.Email}`,
							Password: `${hash}`,
						}
						const result = collection.insertOne(posts)
					});
        			
		          	
		        });
			})
		} catch(e) {
			console.log(e)
		}finally {
		   setTimeout(() => 
		   dbIn.close().then(()=>console.log("Connection closed")), 1500)
		}
	})



	app.get('/adminData', jsonParser, function (request, response, next) {
		console.log("Admin panel working!")
		try {
			dbIn.connect().then(Client => {
				const db = dbIn.db("AdminsAndModerators")
    			const collection = db.collection(collectionIn)

    			const result = collection.find().toArray(function (err, result) {
			      if (err) throw err
			        response.send(result)
			    })
			})
		} catch(e) {
			console.log(e)
		}finally {
		   setTimeout(() => 
		   dbIn.close().then(()=>console.log("Connection closed")), 1500)
		}
	})

	//-------------//
	//   log up    //
	//-------------//

	app.post('/adminLogData', jsonParser, function (request, response, next) {
		console.log("Admin panel working!")
		try {
			dbIn.connect().then(Client => {
				const db = dbIn.db("AdminsAndModerators")
    			const collection = db.collection(collectionIn)

    			const result = collection.find({"Email": request.body.Email}).toArray(function (err, result) {
    				let User;
			      	console.log("------------------------------------------------------------------------")
			        console.log("Result:")
			      	console.log("------------------------------------------------------------------------")
			        console.log(result) 

			        try {
			        	User = {
			    			Email: result[0].Email,
			    			Password: result[0].Password,
			    		}
			        } catch(e) {
			        	console.log("User is not exists")
			        }
			    	

			    	console.log("------------------------------------------------------------------------")
			        console.log("User:")
			    	console.log("------------------------------------------------------------------------")
			        console.log(User)
			        console.log("------------------------------------------------------------------------")
			        console.log("From form:")
			    	console.log("------------------------------------------------------------------------")
			        console.log(request?.body)
			        console.log("------------------------------------------------------------------------")

			        let EmailIsCorrect = (request.body.Email == User.Email)

			        bcrypt.compare(request.body.Password, User.Password, function(err, result) {

			        	EmailIsCorrect ? console.log("Email is correct!") : console.log("Email is not correct");
			        	console.log("------------------------------------------------------------------------")

			        	result ? console.log("Password is correct!"): console.log("Password is not correct");
			        	console.log("result: " + (result == true))
			        	console.log("EmailIsCorrect: " + (EmailIsCorrect == true))
			        	console.log("total: " + (result == true && EmailIsCorrect == true))
			        	if (result == true && EmailIsCorrect == true) {
						request.session.auth = true;
			        	}else{
			        		request.session.auth = false;
			        	}
			        	sessions = request.session;
			        	console.log("session:" + request.session)
			        	console.log("------------------------------------------------------------------------");

					});
	

			    })
			})
		} catch(e) {
			console.log(e)
		}finally {
		   setTimeout(() => 
		   dbIn.close().then(()=>console.log("Connection closed")), 1500)
		}
	})

	app.get('/adminLogData', jsonParser, function (request, response, next) {
		console.log("Admin panel working!")
		//request.session.auth ? console.log("Auth is yes!") : console.log("Auth is not!");
		
		try {
			dbIn.connect().then(Client => {
				const db = dbIn.db("AdminsAndModerators")
    				const collection = db.collection(collectionIn)

    				const result = collection.find().toArray(function (err, result) {

	    			console.log("--------------------")
	    			console.log("AdminLogData")	
	    			console.log("--------------------")
	    			console.log(result)
	    			console.log("--------------------")
				      if (err) throw err
				        response.send(result)

				    })
			})
		} catch(e) {
			console.log(e)
		}finally {
		   setTimeout(() => 
		   dbIn.close().then(()=>console.log("Connection closed")), 1500)
		}
	})

	app.get('/sessionData', jsonParser, function (request, response, next) {
		sessions?.auth ? console.log("Auth is yes!") : console.log("Auth is not!");
		console.log(request.session)
		const SessionData = {
			auth: sessions.auth
		}

		
		response.send(SessionData)

	})
	app.post('/sessionData', jsonParser, function (request, response, next) {
		sessions?.auth ? console.log("Auth is yes!") : console.log("Auth is not!");
		sessions = null
		sessions?.destroy()
	})

	app.get('/deleteThread', jsonParser, function (request, response, next) {
		response.send(response.body)
	})
	app.post('/deleteThread', jsonParser, function (request, response, next) {
		let pathToImageDelete = `./uploads/${request.body.id}` + ".jpg"
		//
		// Deleting from DB and
		//

		try{
		    dbIn.connect().then(Client => {

		    const db = Client.db("posts")
		    const collection = db.collection("postsAnons")
		    const result = collection.deleteOne({"id": request.body.id})
		    fs.access(pathToImageDelete, fs.constants.F_OK, (err) => {
			if (err) {
			    console.error(err);
			    console.log('Файл не существует');
			    return;
			}
			  console.log('Файл существует');
			  fs.unlink(pathToImageDelete);
		});
			
			
			    
		  })
		  }catch (err){
		  } finally {
		    setTimeout(() => 
		    dbIn.close().then(()=>console.log("Connection closed")), 1500)
		  }

	})
}


