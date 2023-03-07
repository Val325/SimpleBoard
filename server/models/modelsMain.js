const http = require("http")
const fs = require('fs-extra')
const express = require('express')
const cors = require("cors")
const jsonParser = express.json()
const modelsImages = require("./modelImages.js")
require('dotenv').config()




module.exports.mainPage = (app, dbIn) => {

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(__dirname + '/public'));
  app.use(cors({
          origin: 'http://localhost:3000',
          credentials: false,
      }))

	app.get('/', function (request, response) {
  		console.log("server start");
	})

	app.get('/data', jsonParser, function (request, response) {
		try{
		  dbIn.connect().then(Client => {
		  const db = dbIn.db("posts")
		  const collection = db.collection("postsAnons")
		  const result = collection.find().toArray(function (err, result) {
		    if (err) throw err
		      response.send(result)
		  })
		  
		  
		})
		}catch (err){
		} finally {
		  setTimeout(() => 
		  dbIn.close().then(()=>console.log("Connection closed")), 1500)
		}
	})

	app.post('/data', jsonParser, function (request, response, next) {
  


   try {
    dbIn.connect().then(Client => {
    const db = dbIn.db("posts")
    const collection = db.collection("postsAnons")

    collection.count().then((count) => {
      const resMax = collection.find({}).toArray(function (err, res) {
      //res[lengthArray-1].id != undefined ? res[lengthArray-1].id++ : 0;
      let lengthArray = (typeof res.length != "undefined") ? res.length : 0;
      let postIdLast = (typeof res[lengthArray-1] != "undefined") ? res[lengthArray-1] : 0;
      //JPGnum = Number(postIdLast.id) + Number(1);
      let counterPosts = isNaN(Number(postIdLast.id) + 1) ? 0 : Number(postIdLast.id) + 1;
      modelsImages.lastPost = counterPosts;


      // создаем новый объект `Date`
      let today = new Date();
       
      // получаем дату и время
      let now = today.toLocaleString();
      console.log(now);

      console.log("----------------------")
      console.log("Count: " + count)
      console.log("----------------------")
      console.log("One iteration post")
      console.log("----------------------")
      console.log("JPGnum: " + modelsImages.JPGnum)
      console.log("postsMax: " + modelsImages.postsMax)
      console.log("id last post: " + postIdLast.id)
      console.log("last post: " + modelsImages.lastPost)
      console.log("counterPost: " + counterPosts)
      console.log("----------------------")

    if (count < modelsImages.postsMax) {
      
      

      const posts = {
        id: `${modelsImages.lastPost}`,
        name: `${request.body.dataName}`,
        text: `${request.body.dataText}`,
        time: `${now}`
      }
      const result = collection.insertOne(posts)
      modelsImages.setLastPost(++counterPosts)

    }else{ 
    //Get first post and delete
      const resFirst = collection.find({}).sort({" id ": -1 }).limit( 1 ).toArray(function (err, result) {
      if (err) throw err
        

        console.log("id for delete: " + result[0].id)
        //Delete image from post
        fs.unlink("./uploads/" + result[0].id + ".jpg", (err) => {

          console.log('Deleted jpg: ' + result[0].id);
        });
        //Delete dir from post
        fs.rmdir("./uploads/" + result[0].id, (err) => {

          console.log('Deleted dir: ' + result[0].id);
        });

        //Delete post and subposts
        collection.deleteOne({id : result[0].id})
        db.collection("postsAnonsId" + result[0].id).drop().then(function () {
          console.log("postsAnonsId" + result[0].id + " - deleted successful!")
        }).catch(function () {
          console.log("postsAnonsId" + result[0].id + " - deleted error!")
        })

        const posts = {
        name: `${request.body.dataName}`,
        text: `${request.body.dataText}`,
        id: `${modelsImages.lastPost}`,
        time: `${now}`
      }
      
      const resOther = collection.insertOne(posts)
      
      modelsImages.setLastPost(++counterPosts)

    })}})})})} catch(e) {
}finally {
  setTimeout(() => 
  dbIn.close().then(()=>console.log("Connection closed")), 1500)
}})
}