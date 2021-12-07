const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

// TODO:
// authentication on deta server
// add imgs, urls field to form
// ~~/delete~~
// on successful deletion, display snackbar or banner
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

const dbUrl = process.env.MONGO_URL || "mongodb://localhost:27017/vera"
const port = process.env.VERA_PORT || 10100

console.log("DB URL:", dbUrl);

mongoose.connect(dbUrl);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/payload', async (req, res) => {
  const droplets = await Droplet.find();

  return res.json(droplets);
});

app.get('/delete', (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "delete.html"));
})

app.post("/delete", async (req, res, next) => {
  const ids = req.body;
  try {
    const dbResponse = await Droplet.deleteMany({
      _id: {
        $in: ids
      }
    });
    const deleteStatus = encodeURIComponent(dbResponse.deletedCount);
    res.redirect("/delete?count=" + deleteStatus);
  } catch (err) {
    console.err(err);
    next();
  }
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

  const statusString = encodeURIComponent("success");
  return res.redirect("/?status=" + statusString);
})

app.use('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
})

if (process.env.ENV === 'test') {
  app.listen(port, () => {
    console.log(`[+] Listening on port ${port}`)
  })
} else {
  // export 'app'
  module.exports = app
}