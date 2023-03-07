const http = require("http")
const fs = require('fs-extra')
const express = require('express')
const multer = require("multer")
const cors = require("cors")

const util= require('util');
const encoder = new util.TextEncoder('utf-8');
//DB
const mongoClient = require("mongodb").MongoClient;
//Parsers
const app = express()
const jsonParser = express.json()
//Api
const front = require("./api.js")
const admin = require("./admin.js")
//models
const modelDB = require("./models/modelDB.js")
const modelMain = require("./models/modelsMain.js")
const modelSubPosts = require("./models/modelsSubPost.js")
const modelsImages = require("./models/modelImages.js")

require('dotenv').config()

const FormData = require('form-data');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cors({
        origin: 'http://localhost:3000',
        credentials: false,
    }))

modelMain.mainPage(app, modelDB.clientDB)
modelSubPosts.subPosts(app, modelDB.clientDB)
modelsImages.images(app)


front.api(app)

admin.admin(app, modelDB.clientDB, "Users")


app.listen(4000, () => {
  console.log(`Server is running`);
});
