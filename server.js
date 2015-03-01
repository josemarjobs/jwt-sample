var util = require('util');
var express = require('express');
var faker = require('faker');
var cors = require('cors');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var jwtSecret = 'sdjfnasdouenadkjfbasdfa/sdf;//?asd';

var app = express();

var user = {
	username: 'stewie',
	password: 'p'
}
app.use(cors());
app.use(bodyParser.json());
app.use(expressJwt({secret: jwtSecret}).unless({path: ['/login']}));

app.get('/random-user', function(req, res){
	var user = faker.helpers.userCard();
	user.avatar = faker.image.avatar();

	res.json(user);
});

app.post('/login', authenticate, function(req, res){
	var token = jwt.sign({
		username: user.username
	}, jwtSecret);

	res.send({
		token: token,
	 	user: user
	});

});

app.listen(3000,function() {
	util.log("App listening on http://localhost:3000");
});
// util functions
function authenticate (req, res, next) {
	var body = req.body;
	if (!body.username || !body.password) {
		res.status(400).end('Must provide username and password');
	}
	if (body.username !== user.username || body.password !== user.password) {
		res.status(401).end('username or password incorrect');
	}
	next();
};







