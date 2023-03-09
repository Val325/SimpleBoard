const http = require("http")
const fs = require('fs-extra')
const express = require('express')
const multer = require("multer")
const cors = require("cors")
const path = require('path');
const modelsImg = require("./modelsSubPost.js")


const postsMax = 9;
let postedPost = 0;
let lastPost = 0;
let JPGnum = 0;



module.exports.postsMax = postsMax;
module.exports.postedPost = postedPost;
module.exports.lastPost = lastPost;
module.exports.JPGnum = JPGnum;


module.exports.setLastPost = (num) => {
	lastPost = num;
}




module.exports.images = (app) => {
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.static(__dirname + '/public'));
	app.use(cors({
	        origin: 'http://localhost:3000',
	        credentials: false,
	    }))


	const storage = multer.diskStorage({
	  destination: function (req, file, cb) {
	    let pathMain = `../uploads`;
	    cb(null, path.resolve(__dirname, pathMain))
	  },
	  filename: function (req, file, cb) {
	    cb(null, String(lastPost) + ".jpg")
	    
	    
	  }
	})

	const storagePosts = multer.diskStorage({
	  destination: function (req, file, cb) {
	    
	    let pathLoad = `../uploads/${modelsImg.getFolderImage()}`;
	    //are has directory?
	    fs.mkdirsSync(pathLoad, { recursive: true })
	      

	    cb(null, path.resolve(__dirname, pathLoad))

	  },
	  filename: function (req, file, cb) {
	    
	    cb(null, String(modelsImg.numberImage()) + ".jpg")
	  }
	})
	var upload = multer({ storage: storage,limits: { fileSize: 10 * 1000 * 1000 }})//

	var uploadPosts = multer({ storage: storagePosts, limits: { fileSize: 10 * 1000 * 1000 }})//

	app.post('/imageData', upload.single('my-image-file'), function (request, response) {
		})
	app.post('/imageDataPost', uploadPosts.single('my-image-inner'), function (request, response) {
		})
}