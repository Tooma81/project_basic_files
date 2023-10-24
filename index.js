const express = require('express')
const app = express()
const fs = require("fs");

//use ejs files to prepare templates for views
const path = require('path')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
	//get data form file 
	fs.readFile("./tasks", "utf-8", (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		console.log(data);
		console.log(typeof data);
		console.log(data.split("\n"))
		//task list data from file
		const tasks = data.split("\n")
		res.render('index', {tasks: tasks})	
	});
})

app.listen(3001, () => {
	console.log('Example is started at http://localhost:3001')
})