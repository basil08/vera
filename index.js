const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

// TODO:
// authentication on deta server
// add imgs, urls field to form
// /delete
// /update
// more robust front end for forms, deletion etc
// Like functionality
// on each new droplet creation, trigger hugo build using GH API


// STREAM consists of DROPLETS ;)
// DROPLET SCHEMA
// ts: string
// title: string (optional)
// body: string
// imgs: [string] (optional)
// urls: [string] (optional)
// likes: int

const dropletSchema = new mongoose.Schema({
  title: String,
  body: String,
  imgs: [String],
  urls: [String],
  likes: Number,
  ts: String      // TODO: change to Date
});

const Droplet = mongoose.model("Droplet", dropletSchema, "droplets");

mongoose.connect(process.env.MONGO_URL);

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/payload', async (req, res) => {
  const droplets = await Droplet.find();

  return res.json(droplets);
});

// add a new droplet
app.post('/create', async (req, res) => {
  const body = req.body;

  // parse and validate the incoming droplet data
  if (!body.body || !body.datetime) {
    return res.status(400).json(body);
  }

  if (body.imgs) {
    const imageURLs = body.imgs.split(",")
      .map(url => url.trim());
  }
  
  if (body.urls) {
    const urls = body.urls.split(",")
      .map(url => url.trim());
  }

  const now = new Date().toLocaleString();

  const droplet = new Droplet({
    title: body.title ? body.title : null,
    body: body.body,
    likes: 0,
    imgs: [],
    urls: [],
    ts: body.datetime 
  });

  await droplet.save();

  return res.status(201).send(`OK: Created new Droplet at server time: ${now}`);
})

app.use('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "form.html"));
})

// export 'app'
module.exports = app