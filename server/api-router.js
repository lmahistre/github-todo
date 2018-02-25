const express = require('express');
const router = express.Router();

const github = require('./github.js');

/**
 * Parses the body and extracts the post data
 */
const reqToPost = function(req, res, callback) {
	var content ='';
	req.on('data', function(data) {
		content+=data;
	});
	req.on('end', function() {
		try {
			const post = JSON.parse(content);
			if (callback && typeof callback == 'function') {
				callback(post);
			}
		}
		catch (err) {
			console.log(err);
			res.send(err);
		}
	});
}


const retFunc = function(err, data) {
	if (err) {
		this.json({
			error : err,
		});
	}
	else {
		this.json({data});
	}
}


/**
 * Get data from Github
 */
router.get('/getData', function(req, res) {
	github.getGistData(retFunc.bind(res));
});


/**
 * Send data to Gist
 */
router.post('/setData', function(req, res) {
	reqToPost(req, res, function(post) {
		github.setGistData(post, retFunc.bind(res));
	});
});


/**
 * Get data from Github
 */
router.get('/importProjects', function(req, res) {
	github.getProjects(retFunc.bind(res));
});


module.exports = router;