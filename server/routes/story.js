const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Schema = mongoose.Schema;

var storySchema = new Schema({
	imagePath: String,
	title: String,
	content: String,
	croppedImage: Buffer
});

var StoryModel = mongoose.model("story", storySchema, "Stories");

exports.getStories = function (req, res) {
	StoryModel.find({}, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			const response = [];
			result.forEach(story => {
				const item = {};
				item.image = "http://localhost:8080/" + story.imagePath;
				item.title = story.title;
				item.content = story.content;
				item.id = story._id;
				item.croppedImage = "data:image/jpeg;base64," + story.croppedImage.toString('base64');
				response.push(item);
			});
			res.json(response);
			console.log("Get stories succussfully!");
                }
        });
}

exports.postStories = function (req, res) {
	if (!req.file || !req.body.croppedImage) {
		return;
	}

	const data = req.body.croppedImage.toString().split(",")[1];
	const buff = Buffer.from(data, 'base64');

	const newStory = new StoryModel({
		title: req.body.title,
		content: req.body.content,
		imagePath: req.file.path,
		croppedImage: buff,
	});

	newStory.save(function (err, story) {
		if (err) return console.error(err);
		res.status(200).json(story);
		console.log("Document inserted succussfully!");
	});
}

exports.updateStoryById = function (req, res) {
	let updateQuery = {};
	if (req.body.title) {
		updateQuery.title = req.body.title;
	}
	if (req.body.content) {
		updateQuery.content = req.body.content;
	}
	if (req.file && req.file.path) {
		updateQuery.imagePath = req.file.path;
	}
	StoryModel.updateOne({ _id: req.params.id }, {
		$set: updateQuery
	}).then(result => {
		res.status(200).json({ message: req.params.id + " updated succussfully!" });
		console.log("Put story succussfully!");
	});
}

exports.deleteStoryById = function (req, res) {
	StoryModel.findOneAndDelete({ _id: req.params.id }, function (err, story) {
        	if (err) {
			console.log(err)
		}
		else {
			console.log("Deleted story: ", story);
			// Remove the image from file
			if (story && story.imagePath) {
				fs.unlink(path.join(appRoot, story.imagePath), function (err) {
					console.log(err);
				});
			}
		}
	}).then(result => {
		res.status(200).json({ message: req.params.id + " deleted succussfully!" });
		console.log("Deleted story succussfully!");
	});
}

