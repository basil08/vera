# VERA - Featured Microblogging Server

Vera is a featured microblogging server, offering control and privacy. It comes packaged with a user interface for managing your droplets.   

## CONCEPT OF DROPLETS & STREAMS

Microblogging sites like Twitter and Mastodon have moved past the stoic objective with which they were originally envisioned. Violence, ineffective regulation, ads, promoted tweets, just **plain noise**. Vera was envisioned to offer users the freedom and pleasure of micro-blogging without paying any price for it. Few concepts below:  

What's a "droplet"? A droplet is the atomic entity that Vera manages. If you are familiar with public microblogging sites like Twitter, then a droplet is analogous to a tweet.   

Similarly, the notion of a "stream" is a collection of droplets chronologically timestamped. 

By default, a droplet contains a mandatory body (with no limits on character count!), an optional title, and an imgs field for comma-separated URLs for images. (A separate URL field is in the making). We support markdown in all text fields.  

## WHAT VERA OFFERS?

- Control and privacy
- Offers a builtin management UI to create/read/delete droplets.
- Responsive, plain JavaScript, optimized for fast transactions
- Flexible droplet schema
- Provides an endpoint for data consumption
- Consume your data wherever you want!

## HOW TO USE VERA?

### Self-host  

The idea of Vera is to provide full control over your data. Hence, we suggest to self-host your data stores. 

1. Expose your custom port and export in `.env`. Vera uses port 10100 by default. 
2. Configure a Mongo database. The challenges of maintaining a self-hosted database quickly outweighs its advantages so we suggest a third-party solution like [Mongo Atlas][3] or [mLab][4].

### Third-party hosting solutions  

You can explore any platform that serves a Node.js app, depending on your requirements. Heroku, AWS, GCP, DigitalOcean are few common choices.   

A test version of Vera is hosted on the awesome [Deta][2] platform. If you're a developer, you must check it out!  


## ROADMAP 

[] Add URL field to forms. Allow preview/banner during stream rendering.  
[X] Style droplet list elements in delete.html   
[X] Add footer    
[] On successful deletion, display response snackbar/banner.   
[] BE: Implement /update   
[] UI: Style navbar    
[] UI: Implement Like functionality   
[] On each new droplet creation, trigger build action using GH API    
[] Refactor: Organize routes into a module (`app.use("/", routes)`)   
[] Add CONTRIBUTING, LICENSE, and links to them in README    

## FEATURES & TODOs 

~~1. Explore templating engines such as [Jade][0] or [Jinja2][1]~~ (Using [nunjucks][5]!)   
2. Implement JWT Authentication middleware.   
3. Design: Redesign UI    
4. Migrate codebase to TypeScript    
## CONTRIBUTE   

Glad that you're interested in supporting Vera!  

We accept technical code contributions (see Issues tab), documentation, and even examples. Vera is written in JavaScript, Express, Mongoose (MongoDB) on the backend and vanilla HTML/CSS on the frontend it offers. We are planning to migrate to TypeScript and a templating engine in the future. Read the [CONTRIBUTING.md][6] before opening a PR!    

## LICENSE 

The Vera source code is distributed under the [MIT][7] License.  

[0]: https://jade-lang.com
[1]: https://jinja.palletprojects.com
[2]: https://deta.dev
[3]: https://www.mongodb.com/cloud/atlas/
[4]: https://mlab.com
[5]: https://mozilla.github.io/nunjucks/getting-started.html
[6]: /CONTRIBUTING.md
[7]: /LICENSE