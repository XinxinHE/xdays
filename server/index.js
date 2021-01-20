require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
const app = express();
const multer = require('multer');
const mongoose = require('mongoose');
const timelinePost = require('./routes/timelinePost');
const story = require('./routes/story');

const port = process.env.PORT || 8080;
global.appRoot = path.resolve(__dirname);

// session support is required to use ExpressOIDC(Express OpenID Connect).
// This code block creates session middleware with the options we passed it. 
// OIDC is an authentication layer on top of OAuth 2.0
app.use(session({
	secret: process.env.RANDOM_SECRET_WORD,
	resave: true,
	saveUninitialized: false
}));

// Creates an instance of ExpressOIDC with the option we passed in.
const oidc = new ExpressOIDC({
	issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
	client_id: process.env.OKTA_CLIENT_ID,
	client_secret: process.env.OKTA_CLIENT_SECRET,
	appBaseUrl: process.env.BASE_URL,
	loginRedirectUri: process.env.REDIRECT_URL,
	scope: 'openid profile',
	routes: {
		loginCallback: {
			path: '/authorization-code/callback',
			afterCallback: '/admin'
		}
	}
});

// ExpressOIDC will attach handlers for the /login and /authorization-code/callback routes
app.use(oidc.router);
app.use(cors());
app.use(bodyParser.json());
//__dirname gives you the path of the currently running file.
app.use(express.static(path.join(appRoot, '../client/public')));

app.get('/protected', oidc.ensureAuthenticated(), (req, res) => {
	res.send('Top Secret');
});

app.get('/home', (req, res) => {
	console.log(`${process.env.BASE_URL}:${port}${process.env.REDIRECT_PATH}`);
	res.sendFile(path.join(appRoot, './public/home.html'));
});

app.get('/admin', oidc.ensureAuthenticated(), (req, res) => {
	res.sendFile(path.join(appRoot, './public/admin.html'));
});

app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/home');
});

var multerStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/uploads/')
	},
	filename: function (req, file, cb) {
		const ext = file.mimetype.split('/')[1];
		cb(null, `xdays-${Date.now()}.${ext}`);
	}
});

const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else if (file.mimetype.startsWith('application')) {
		cb(null, false);
	} else {
		cb(new Error('Not an image! Please upload an image.'), false);
	}
};

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter
});

mongoose.connect(
	'mongodb+srv://xinxhe:hxhx11180103@cluster0.djtwo.mongodb.net/xinxhe?retryWrites=true&w=majority',
	{ useNewUrlParser: true, useUnifiedTopology: true }
);

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
	console.log("Connection Successful!");
});

app.get('/stories', story.getStories);
app.post('/stories', upload.single('image'), story.postStories);
app.put('/stories/:id', upload.single('image'), story.updateStoryById);
app.delete('/stories/:id', story.deleteStoryById);

// Serve image through path
app.get('/public/uploads/:id', function (req, res) {
	res.sendFile(path.join(appRoot, req.url));
});

app.get('/timelinePosts/:storyId', timelinePost.getTimelinePosts);
app.post('/timelinePosts', timelinePost.postTimelinePosts);
app.put('/timelinePosts/:id', timelinePost.updateTimelinePostById);

oidc.on('error', err => {
	// An error occurred while setting up OIDC
	console.log("oidc error: ", err);
});

oidc.on('ready', () => {
	app.listen(port, () => console.log(`My Blog App listening on port ${port}!`))
});
