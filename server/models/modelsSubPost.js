const http = require("http")
const fs = require('fs-extra')
const express = require('express')
const multer = require("multer")
const cors = require("cors")
const jsonParser = express.json()
const modelsImages = require("./modelImages.js")
const modelDB = require("./modelDB.js")

let postCounter;

let folderImage = 0;
let numImage;

module.exports.numberImage = () =>{
  if (numImage === undefined) {
    numImage = 0;
  }
  console.log("numImage: " + numImage)
  return numImage;
}
module.exports.setNumberImage = (num) =>{
  numImage = num;
  console.log("numImage: " + numImage)
  return numImage;
}

module.exports.getFolderImage = () =>{
  return folderImage;
}
module.exports.setFolderImage = (num) =>{
  folderImage = num;
  return folderImage;
}


module.exports.subPosts = (app, dbIn) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(__dirname + '/public'));
  app.use(cors({
          origin: 'http://localhost:3000',
          credentials: false,
      }))

//GetSubposts
app.get('/data/:threadId', jsonParser, function (request, response) {
  //folderImage = request.params["threadId"];
  //console.log("folderImage: " + folderImage)
  modelDB.subPostsGet(request, response)
})
  /*
  fs.mkdirsSync('./uploads/' + folderImage, { recursive: true })

  let filesInner = fs.readdirSync('./uploads/' + folderImage);
  let jpgsInner = filesInner.filter(function(el, i) {
    return el.substring(el.length - 3) == 'jpg';
  })

  try{
    dbIn.connect().then(Client => {

    const db = dbIn.db("posts")
    const collection = db.collection("postsAnonsId" + request.params["threadId"])
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
*/
//Subposts
app.post('/data/:threadId', jsonParser, function (request, response, next) {

  modelDB.subPostPost(request)

})

}
  /*
  let today = new Date();
  let now = today.toLocaleString();

  folderImage = request.params["threadId"];
  console.log(request.params["threadId"])
  
  fs.mkdirsSync('./uploads/' + folderImage, { recursive: true })//

  let filesInner = fs.readdirSync('./uploads/' + folderImage);
  let jpgsInner = filesInner.filter(function(el, i) {
    return el.substring(el.length - 3) == 'jpg';
  })
  numImage = jpgsInner.length;

  try {
     dbIn.connect().then(Client => {
    

    const db = dbIn.db("posts")
    const collection = db.collection("postsAnonsId" + request.params["threadId"])
    

    
    
      collection.count().then((count) => {
        
        
          const posts = {
            id: `${modelsImages.lastPost}`,
            name: `${request.body.dataName}`,
            text: `${request.body.dataText}`,
            time: `${now}`
          }

          const result = collection.insertOne(posts)
          numImage = ++count;
          
      });
    
      
    
   
    
      setTimeout(() => 
          dbIn.close().then(()=>console.log("Connection closed")), 2500)

     })} catch(e) {
    }

*/
