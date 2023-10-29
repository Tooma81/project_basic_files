const express = require('express')
const app = express()
const fs = require("fs");

//use ejs files to prepare templates for views
const path = require('path')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const readFile = (filename) => {
	return new Promise((resolve, reject) => {
		//get data form file 
		fs.readFile(filename, "utf-8", (err, data) => {
			if (err) {
				console.error(err);
				return;
			}
			//task list data from file
			const tasks = JSON.parse(data)
			resolve(tasks)	
		});
	})
}

const writeFile = (filename, data) => {
	return new Promise((resolve, reject) => {
		// get data from file
		fs.writeFile(filename, data, "utf-8", err => {
			if (err) {
				console.error(err);
				return;
			}
			resolve(true)
		})
	})
}
app.get('/', (req, res) => {
	//tasks list data from file
	readFile("./tasks.json")
		.then(tasks => {
			res.render("index", {
				tasks: tasks,
				error: null
			})
		})	
})

//For parsing applications
app.use(express.urlencoded({ extended: true }));

app.post("/", (req, res) => {
	//check input data
	if(req.body.task.trim().length == 0){
		error = "Please insert a task"
		readFile("./tasks.json")
		.then(tasks => {
			res.render("index", {
				tasks: tasks,
				error: error
			})
		})
	} else {
	//tasks list data from file
	readFile("./tasks.json")
		.then(tasks => {
			//add new task
			//create new id
			let index
			if (tasks.length === 0)
			{
				index = 0
			} else {
				index = tasks[tasks.length-1].id + 1;
			}
			//create task object
			const newTask = {
				"id" : index,
				"task" : req.body.task
			}
			tasks.push(newTask)
			data = JSON.stringify(tasks, null, 2)
			writeFile("tasks.json", data)
			res.redirect("/")
		})
	}	
})

app.get("/delete-task/:taskId", (req, res) => {
	let deletedTaskId = parseInt(req.params.taskId)
	readFile("./tasks.json")
	.then(tasks => {
		tasks.forEach((task, index) => {
			if(task.id === deletedTaskId) {
				tasks.splice(index, 1)
			}
		})
		data = JSON.stringify(tasks, null, 2)
		writeFile("tasks.json", data)
		res.redirect("/")
	})
})

app.get("/delete-tasks", (req, res) => {
	readFile("./tasks.json")
	.then(tasks => {
		tasks.splice(0);
		data = JSON.stringify(tasks, null, 2)
		writeFile("tasks.json", data)
	})
	res.redirect("/")
})


app.listen(3001, () => {
	console.log('Example is started at http://localhost:3001')
})