const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const Recipe = require('./models/recipe');


const app = express();

mongoose.connect('mongodb+srv://stanyke:tlJJA8FT6Uo8VDYx@cluster0-oonnm.mongodb.net/test?retryWrites=true&w=majority')
.then(() =>
{
	console.log("Hello, You Have Successfully connected to MongoDb Atlas!");
})
.catch((error) =>
{
	console.log("Hello, Unable to connect to MongoDb Atlas!");
	console.error(error);
});

app.use((req, res,next) =>
{
	res.setHeader('Access-Control-Allow-Origin', '*');
	
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});



app.use(bodyParser.json());


app.post('/api/recipes', (req, res, next) =>
{
	const myrecipe = new Recipe({
		title: req.body.title,
		ingredients: req.body.ingredients,
		instructions: req.body.instructions,
		difficulty: req.body.difficulty,
		time: req.body.time,
	});
	
	myrecipe.save().then(() =>
	{
		res.status(201).json({
			message: "Post Successfully Created!"
		});
	})
	.catch((error) =>
		{
			res.status(400).json({
				error: error
			});
			console.error(error);
		}
	);
});




app.get('/api/recipes/:id', (req, res, next) =>
{
	Recipe.findOne({
		_id: req.params.id
	})
	.then((myrecipe) =>
	{
		res.status(200).json(myrecipe);
	})
	.catch((error) =>
	{
		res.status(404).json({
			error: error
		});
	});
});



app.put('/api/recipes/:id', (req, res, next) =>
{
	const myrecipe = new Recipe({
		_id: req.params.id,
		title: req.body.title,
		ingredients: req.body.ingredients,
		instructions: req.body.instructions,
		difficulty: req.body.difficulty,
		time: req.body.time,
	});
	Recipe.updateOne({_id: req.params.id}, myrecipe)
	.then(() =>
	{
		res.status(201).json({
			message: 'Recipe updated successfully!'
		});
	})
	.catch((error) =>
	{
		res.status(400).json({
			error: error
		});
	});
})


app.delete('/api/recipes/:id', (req, res, next) =>
{
	Recipe.deleteOne({_id: req.params.id})
	.then(() =>
	{
		res.status(200).json({
			message: 'Recipe Deleted!'
		});
	})
	.catch((error) =>
	{
		res.status(400).json({
			error: error
		});
	});
});


app.use('/api/recipes', (req, res, next)=>
{
	Recipe.find().then((myrecipes) =>
	{
		res.status(200).json(myrecipes);
	})
	.catch((error) =>
	{
		res.status(400).json({
				error: error
			});
	});
});

module.exports = app;
