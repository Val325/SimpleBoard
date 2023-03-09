const mongoClient = require("mongodb").MongoClient;
const modelsImages = require("./modelImages.js")
const modelsSubPost = require("./modelsSubPost.js")

const fs = require('fs-extra')

require('dotenv').config()

const url = "mongodb+srv://" + process.env.DB_LOGIN + ":" + process.env.DB_PASS + "@cluster0.4hkqkqk.mongodb.net/?retryWrites=true&w=majority"
const Client = new mongoClient(url, { useNewUrlParser: true })

module.exports.urlDB = url;
module.exports.clientDB = Client;

module.exports.getAmountPosts = async() =>{

	try{
		const database = await Client
		const collection = await database.db("posts").collection("postsAnons")
		return await collection.find({}).toArray().length

	}catch (err){
		console.log("Error: " + err)
	} finally {
		//await dbIn.close();
	}
}

const getAmountFunc = async(id) =>{
	let numPost
	try{
		const database = await Client
		const collection = await database.db("posts").collection("postsAnonsId" + id)
		numPost = await collection.find({}).toArray()

	}catch (err){
		console.log("Error: " + err)
	} finally {
		//await dbIn.close();
	}

	return numPost
}
module.exports.getAmountSubPosts = getAmountFunc;


module.exports.PostsGet = async(res) =>{

	try{
		const db = await Client.db("posts");
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

    let responseLocation = await fetch("https://ipapi.co/json/");
    let data = await responseLocation.json();

	try {
		const database = await Client
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
      	console.log("resMax length: ")
      	console.log(resMax.length)
      	console.log("resMax: ")
      	console.log("JPGnum: " + modelsImages.JPGnum)
      	console.log("postsMax: " + modelsImages.postsMax)
      	console.log("id last post: " + postIdLast.id)
      	console.log("last post: " + modelsImages.lastPost)
      	console.log("counterPost: " + counterPosts)
      	console.log("----------------------")

    	if (amountPosts < modelsImages.postsMax) {
    	  		const posts = {
    	  		  	id: `${resMax.length}`,
    	  		  	name: `${req.body.dataName}`,
    	  		  	text: `${req.body.dataText}`,
    	  		  	time: `${now}`,
    		    	ip: `${data.ip}`
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
    		    id: `${getAmountPosts()}`,	
    		    name: `${req.body.dataName}`,
    		    text: `${req.body.dataText}`,
    		    time: `${now}`,
    		    ip: `${data.ip}`
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


module.exports.subPostsGet = async(req, res) =>{
	modelsSubPost.setFolderImage(req.params["threadId"])
	let folderImage = req.params["threadId"];
	console.log("folderImage (params[threadId]): " + folderImage)

	await fs.mkdirs('./uploads/' + folderImage, { recursive: true })

	let filesInner = await fs.readdir('./uploads/' + folderImage);
	let jpgsInner = filesInner.filter(function(el, i) {
	  return el.substring(el.length - 3) == 'jpg';
	})

	try{
		const db = await Client.db("posts");
		const collection = await db.collection("postsAnonsId" + req.params["threadId"])
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

module.exports.subPostPost = async (req) =>{
	// создаем новый объект `Date`
    let today = new Date();
     
    // получаем дату и время
    let now = today.toLocaleString();

    let responseLocation = await fetch("https://ipapi.co/json/");
    let data = await responseLocation.json();

    let folderImage = req.params['threadId'];
    console.log("SubPost: " + folderImage)

    await fs.mkdirs('./uploads/' + folderImage, { recursive: true })
    let filesInner = await fs.readdir('./uploads/' + folderImage);
  	let jpgsInner = filesInner.filter(function(el, i) {
  	  return el.substring(el.length - 3) == 'jpg';
  	})
  	let numImage = jpgsInner.length;

	try {
		const database = await Client
		const collection = await database.db("posts").collection("postsAnonsId" + req.params["threadId"])
		const postsNum = await collection.find({}).toArray()

		//against id you can use modelsImages.lastPost
		const posts = {
            id: `${postsNum.length}`,
            name: `${req.body.dataName}`,
            text: `${req.body.dataText}`,
            time: `${now}`,
            ip: `${data.ip}`
        }
        const result = await collection.insertOne(posts)
        modelsSubPost.setNumberImage(++postsNum.length);
    		
      		
      		
      	
	}catch(e) {
		console.log(e);
	}finally{
		//await dbIn.close();
	}
}
////