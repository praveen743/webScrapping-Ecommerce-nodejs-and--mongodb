const express = require("express");
const app = express();
const request = require('request');
const cheerio = require('cheerio');
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const URL = "mongodb+srv://praveen7:prmdb7@cluster0.8tubo.mongodb.net/?retryWrites=true&w=majority";


const cors = require("cors");
const { response } = require("express");
app.use(cors({
  origin: "*"
}))

let arr = [];
request('https://www.flipkart.com/search?q=iphone&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off', (error,
  response, html) => {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);
    $('._3pLy-c').each((i, el) => {
      const title = $(el).find('._4rR01T').text();
      const price = $(el).find('._30jeq3').text();
      const rating = $(el).find('._3LWZlK').text();
      const imgurl = $(el).find('._396cs4').attr('src');
      const website = "flipkart";
      arr.push({website, title ,price,rating,imgurl});
    });
    console.log(arr);
 
}
  else {
    console.log(error)
  }
});

request('https://www.amazon.in/s?k=iphone&crid=58MTH0QRSPCR&sprefix=iphone%2Caps%2C274&ref=nb_sb_noss_1', (error,
  response, html) => {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);
    $('.sg-row').each((i, el) => {
      const title = $(el).find('.a-size-medium').text();
      const rating = $(el).find('.a-icon-alt').text();
      const price = $(el).find('.a-offscreen').text();
      const imgurl = $(el).find('.a-link-normal').attr('href');
      const website = "amazon";
      arr.push({ website,title,rating,price,imgurl});
      
    });
    console.log(arr)
    
 
}
  else {
    console.log(error)
  }
});

app.post("/scrapdata", async function (req, res) {
  try {
      let connection = await mongoClient.connect(URL);
      let db = connection.db("webscraping")
      await db.collection("scrapdata").insertMany(arr)
      await connection.close();
      res.json({ message: "User Added" })
  } catch (error) {
      console.log(error)
  }
});

app.get("/scrapdata", async function (req, res) {
  try {
      let connection = await mongoClient.connect(URL);
      let db = connection.db("webscraping");
      let users = await db.collection("scrapdata").find({}).toArray();
      await connection.close();
      res.json(users);
  } catch (error) {
      console.log(error)
  }
  // res.json(usersList)
});


// app.post("/key", async function (req, res) {
//   try {
//       let connection = await mongoClient.connect(URL);
//       let db = connection.db("webscraping");
//       let users = await db.collection("scrapdata").find({title:req.body.key}).toArray();
//       await connection.close();
//       res.json(users);
//   } catch (error) {
//       console.log(error)
//   }
//   // res.json(usersList)
// });

app.listen(3002)