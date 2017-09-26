const express = require('express');
const router = express.Router();
const superagent = require('superagent');
const log = require('./../../utils/logger');
const Endpoints = require('./../../conf/services-endpoints');
const TempConfig = require('./../../conf/tmp');
let multer = require('multer');
let upload = multer();

router.get('/', function(res,res) { res.sendStatus(200); });
router.post('/newemail', upload.any(), emailReceived);

module.exports = router;


function emailReceived(req, res) {
	log('info', 'email-newemail', JSON.stringify(req.body));

	const { fromEmail, subject, body } = JSON.parse(req.body.data);
	
	const newTask = {
		title : subject, 
		description : body,
		tags : ['imported'],
		project : TempConfig.importTestProject, // TODO map from board? same name?
		created_by : TempConfig.importTestUser, // need to map creator by trello username. we should do this on the services project
		origin : 'email'
	}

	superagent
		.post(Endpoints.addTask)
		.send(newTask)
		.set('Authorization', Endpoints.authToken)
		.then(response => response.body)
		.then(body => log('info', 'email-newemail-response', JSON.stringify(body)))
		.catch(error => log('error', 'email-newemail-response', error.message))

	res.sendStatus(200);
}