const mongoClient = require("mongodb").MongoClient;
require('dotenv').config()

const url = "mongodb+srv://" + process.env.DB_LOGIN + ":" + process.env.DB_PASS + "@cluster0.4hkqkqk.mongodb.net/?retryWrites=true&w=majority"
const Client = new mongoClient(url)

module.exports.urlDB = url;
module.exports.clientDB = Client;