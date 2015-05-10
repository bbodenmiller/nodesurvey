# Invisible Anonymous Voting

- Humans send a SMS to phone number #
- The first number parsed from the message body is the team they are voting for

## Mongo query

### Verify vote count by team number
```
db.subscribers.aggregate(
    {"$match":{"vote":{"$ne":0}}}, 
    {"$group":{"_id":"$vote", "sum":{"$sum":1}}} 
)
```

[Learn more about this code in our interactive code walkthrough](https://www.twilio.com/docs/howto/walkthrough/automated-survey/node/express).

# Running the Project in production

## Step 1: Deploy to Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/bellevuerails/nodesurvey)

# Running the Project on Your Machine

To run this project on your computer, download or clone the source. You will also need to download and install either [Node.js](http://nodejs.org/) or [io.js](https://iojs.org/en/index.html), both of which should also install [npm](https://www.npmjs.com/). You will also need to [sign up for a Twilio account](https://www.twilio.com/try-twilio) if you don't have one already.

## Step 0

###Mongo Setup

- start mongod if it's not already running
- create a Mongo Database `n3kidvote` and `admin` user with role `dbAdmin`
 - The easy way, use Mongo Chef to create locally
 - http://docs.mongodb.org/manual/reference/built-in-roles/

###Set Twilio and Mongo URL environment variables

```
export TWILIO_NUMBER=+1###      NOTE: no dashes, spaces or parens
export TWILIO_ACCOUNT_SID=***   NOTE: Use Test during development so you don't get charged
export TWILIO_AUTH_TOKEN=***    
export MONGO_URL=mongodb://admin:admin@localhost:27017/n3kidvote
```

###`ngrok` stuff - make localhost available to the Internet

- create an account at https://ngrok.com/
- copy the string and run locally with your token
`./ngrok http -subdomain=n3kidvote 3000`

###Twilio Numbers -> Manage Numbers

Update Twilio number endpoint with the grok address (above)

- an example: https://n3kidvote.ngrok.io/message

NOTE: The subdomain must be unique so we might do something like `{name.}n3kidvote` to avoid collisions

## Step 1: Install Dependencies

Navigate to the project directory in your terminal and run:

```bash
npm install
```

This should install all of our project dependencies from npm into a local `node_modules` folder.

## Step 2: Configuration

Next, open `config.js` at the root of the project and update it with values from your environment and your [Twilio account](https://www.twilio.com/user/account/voice-messaging). You can either export these values as system environment variables (this is the default setup), or you can replace these values with hard-coded strings (be careful you don't commit them to git!).

This sample application stores data in a MongoDB database using [Mongoose](http://mongoosejs.com/). You can download and run MongoDB yourself ([OS X](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/), [Linux](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/), [Windows](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/)), or you can use a hosted service like [compose.io](https://www.compose.io/).  Our application will be looking for a fully qualified MongoDB connection string with a username and password embedded in it.

## Step 3: Running the Project

To launch the application, you can use `node .` in the project's root directory. You might also consider using [nodemon](https://github.com/remy/nodemon) for this. It works just like the node command, but automatically restarts your application when you change any source code files.

```bash
npm install -g nodemon
nodemon .
```

## Step 4: Exposing Webhooks to Twilio

You will likely need to expose your local Node.js web application on the public Internet to work with Twilio. We recommend using [ngrok](https://ngrok.com/docs) to accomplish this. Use ngrok to expose a local port and get a publicly accessible URL you can use to accept incoming calls or texts to your Twilio numbers.

The following example would expose your local Node application running on port 3000 at `http://chunky-danger-monkey.ngrok.com` (reserved subdomains are a paid feature of ngrok):

```bash
ngrok -subdomain=chunky-danger-monkey 3000
```