const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Schema = mongoose.Schema;

var postSchema = new Schema({
	storyId: String,
	title: String,
	content: String
});

var PostModel = mongoose.model("timelinePost", postSchema, "TimelinePosts");

exports.getTimelinePosts = function (req, res) {
	PostModel.find({storyId: req.params.storyId}, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			const response = [];
			result.forEach(post => {
				const item = {};
				item.title = post.title;
				item.content = post.content;
				item.id = post._id;
				response.push(item);
			});
			res.json(response);
			console.log("Get timeline posts succussfully!");
        }
    });
}

exports.postTimelinePosts = function (req, res) {
	const newTimelinePost = new PostModel({
		storyId: req.body.storyId,
		title: req.body.title,
		content: req.body.content
    });
    console.log(req.body);
	newTimelinePost.save(function (err, timelinePost) {
		if (err) return console.error(err);
		res.status(200).json(timelinePost);
		console.log("Timeline posts inserted succussfully!");
	});
}

exports.updateTimelinePostById = function (req, res) {
	let updateQuery = {};
	if (req.body.title) {
		updateQuery.title = req.body.title;
	}
	if (req.body.content) {
		updateQuery.content = req.body.content;
    }
    
	PostModel.updateOne({ _id: req.params.id }, {
		$set: updateQuery
	}).then(result => {
		res.status(200).json({ message: req.params.id + " updated succussfully!" });
		console.log("Put timeline post succussfully!");
	});
}