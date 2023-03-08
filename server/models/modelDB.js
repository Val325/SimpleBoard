const mongoClient = require("mongodb").MongoClient;
const modelsImages = require("./modelImages.js")
const fs = require('fs-extra')

require('dotenv').config()

const url = "mongodb+srv://" + process.env.DB_LOGIN + ":" + process.env.DB_PASS + "@cluster0.4hkqkqk.mongodb.net/?retryWrites=true&w=majority"
const Client = new mongoClient(url, { useNewUrlParser: true })

module.exports.urlDB = url;
module.exports.clientDB = Client;


module.exports.PostsGet = async(res, dbIn) =>{

	try{
		const db = await dbIn.db("posts");
		const collection = await db.collection("postsAnons")
		const result = await collection.find().toArray(function (err, result) {
		    if (err) throw err
		      res.send(result)
		  })
	}catch (err){
		console.log("Error: " + err)
	} finally {
		//await dbIn.close();
	}
}

module.exports.PostPost = async (req, dbIn, modelsImage) =>{
	// создаем новый объект `Date`
    let today = new Date();
     
    // получаем дату и время
    let now = today.toLocaleString();

	try {
		const database = await dbIn
		const collection = await database.db("posts").collection("postsAnons")
		const amountPosts = await collection.count()

		const resMax = await collection.find({}).toArray()
      	let lengthArray = (typeof amountPosts != "undefined") ? amountPosts : 0;
      	let postIdLast = (typeof resMax[lengthArray-1] != "undefined") ? resMax[lengthArray-1] : 0;
      	let counterPosts = isNaN(Number(postIdLast.id) + 1) ? 0 : Number(postIdLast.id) + 1;
      	modelsImage.lastPost = counterPosts;

      	console.log("----------------------")
      	console.log("Count: " + amountPosts)
      	console.log("----------------------")
      	console.log("One iteration post")
      	console.log("----------------------")
      	console.log("resMax: ")
      	console.log(resMax)
      	console.log("resMax: ")
      	console.log("JPGnum: " + modelsImages.JPGnum)
      	console.log("postsMax: " + modelsImages.postsMax)
      	console.log("id last post: " + postIdLast.id)
      	console.log("last post: " + modelsImages.lastPost)
      	console.log("counterPost: " + counterPosts)
      	console.log("----------------------")

    	if (amountPosts < modelsImages.postsMax) {
    	  		const posts = {
    	  		  id: `${modelsImages.lastPost}`,
    	  		  name: `${req.body.dataName}`,
    	  		  text: `${req.body.dataText}`,
    	  		  time: `${now}`
    	  		}
    	  		const result = await collection.insertOne(posts)
    	  		modelsImages.setLastPost(++counterPosts)
	
    	}else{ 
    	//Get first post and delete
      	const resFirst = await collection.find({}).sort({" id ": -1 }).limit( 1 )
      		
        	
	
        	console.log("id for delete: " + resMax[0].id)
        	//Delete image from post
        	fs.unlink("./uploads/" + resMax[0].id + ".jpg", (err) => {
	
        	  console.log('Deleted jpg: ' + resMax[0].id);
        	});
        	//Delete dir from post
        	fs.rmdir("./uploads/" + resMax[0].id, (err) => {
	
        	  console.log('Deleted dir: ' + resMax[0].id);
        	});
	
			const posts = {
    		    id: `${modelsImages.lastPost}`,	
    		    name: `${req.body.dataName}`,
    		    text: `${req.body.dataText}`,
    		    time: `${now}`
    		}
      		modelsImages.setLastPost(++counterPosts)
      		const resOther = await collection.insertOne(posts)

        	//Delete post and subposts
        	delPost = await collection.deleteOne({id : resMax[0].id})
	
        	db.collection("postsAnonsId" + resMax[0].id).drop().then(function () {
        	  console.log("postsAnonsId" + resMax[0].id + " - deleted successful!")
        	}).catch(function () {
        	  console.log("postsAnonsId" + resMax[0].id + " - deleted error!")
        	})

    		
      		
      		
      	}
	}catch(e) {
		console.log(e);
	}finally{
		//await dbIn.close();
	}
}
////