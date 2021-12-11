const express = require("express");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const path = require("path");
const nunjucks = require("nunjucks");
const app = express();

/**
 * DROPLET SCHEMA
 * ts: string
 * title: string (optional)
 * body: string
 * imgs: [string] (optional)
 * urls: [string] (optional)
 * likes: int
 */

const dropletSchema = new mongoose.Schema({
  title: String,
  body: String,
  imgs: [String],
  urls: [String],
  likes: Number,
  ts: String      // TODO: change to Date
});

// Nunjucks Templating Engine
// Check the docs here: https://mozilla.github.io/nunjucks/getting-started.html
nunjucks.configure( 'views', { 
  autoescape: true,
  express: app
});

const Droplet = mongoose.model("Droplet", dropletSchema, "droplets");

const dbUrl = process.env.MONGO_URL || "mongodb://localhost:27017/vera"
// used only in local dev/testing environments
// deta only requires app to be exported
const port = process.env.VERA_PORT || 10100

console.log("DB URL:", dbUrl);

mongoose.connect(dbUrl);

// delete works by sending an Array of droplet IDs to the server
// uses mongoose.deleteMany(_id: { $in: Array })
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));

app.get('/payload', async (req, res) => {
  const droplets = await Droplet.find();

  return res.json(droplets);
});

app.get('/delete', async (req, res, next) => {
  const payload = await Droplet.find();
  res.render("delete.njk", { payload });
})

app.post("/delete", async (req, res, next) => {
  const ids = req.body;
  const password = ids.pop();

  if (password !== process.env.PASS) {
    return res.status(403).send("Forbidden! Deletion is a privileged operation!")
  }

  try {
    const dbResponse = await Droplet.deleteMany({
      _id: {
        $in: ids
      }
    });

    const response = await triggerGHBuild("droplet_deletion_build");

    // TODO: not working as expected. Look into it :)
    const deleteStatus = encodeURIComponent(dbResponse.deletedCount);

    res.redirect("/delete?status=success");
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

  let imageURLs = [];

  if (body.imgs) {
    imageURLs = body.imgs.split(",")
      .map(url => url.trim());
  }

  if (body.urls) {
    const urls = body.urls.split(",")
      .map(url => url.trim());
  }

  const now = new Date(body.datetime).toISOString();
  
  if (body.password !== process.env.PASS) {
    return res.status(403).send("Forbidden! This is a privileged operation!");
  }

  const droplet = new Droplet({
    title: body.title ? body.title : null,
    body: body.body,
    likes: 0,
    imgs: body.imgs ? imageURLs : [],
    urls: [],
    ts: now
  });

  await droplet.save();

  const response = await triggerGHBuild("droplet_creation_build");

  return res.redirect("/?status=success");
})

app.use('/', (req, res, next) => {
  res.render("index.njk");
})

// set ENV only in test env
// npm script takes care of that, just run `npm run dev`
if (process.env.ENV === 'test') {
  app.listen(port, () => {
    console.log(`[+] Listening on port ${port}`)
  })
}


const triggerGHBuild = async (eventName) => {
  const OWNER = process.env.GITHUB_OWNER;
  const REPO = process.env.GITHUB_REPO;
  const EVENT_NAME = `${eventName} ${new Date().toUTCString()}`

  let response = null;
  try {
    response = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/dispatches`, {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${process.env.GITHUB_ACTIONS_ACCESS_TOKEN}`
      },
      body: `{ "event_type": "${EVENT_NAME}" }`
    })
  } catch (err) {
    console.err(err);
  }

  return response;
}
// export the 'app'
module.exports = app;