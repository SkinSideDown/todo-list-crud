//npm install express mongodb mongoose ejs dotenv
//npm install nodemon --save-dev
    //"dev": "nodemon server.js"

//Declare variables
const express = require("express")
const app = express()
const mongoose = require("mongoose")
require('dotenv').config()
const PORT = process.env.PORT
const TodoTask = require('./models/todotask')

//Set Middleware
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))

mongoose.connect(process.env.DB_STRING, 
    { useNewUrlParser: true })
    .then( ()=>
       console.log("Connected to Database")
   )

//GET
app.get('/', async (req, res) => {
    try {
            TodoTask.find({}).then(tasks => {
                res.render('index.ejs', {
                    todoTasks: tasks
                })
            })
        } catch (err) {
            res.status(500).send({message: err.message})
    }
})

//POST
app.post('/', async (req, res) => {
    const todoTask = new TodoTask(
        {
            title: req.body.title,
            content: req.body.content
        }
    )
    try {
        await todoTask.save()
        console.log(todoTask)
        res.redirect('/')
    } catch (err) {
        if (err) return res.status(500).send({message: err.message})
        res.redirect('/')
    }
})

//UPDATE
app
    .route('/edit/:id')
    .get((req, res) => {
        const id = req.params.id
        TodoTask.find({}).then(tasks => {
            res.render('edit.ejs', {
                todoTasks:tasks, idTask: id })
            })
        })
        .post((req, res) => {
            const id = req.params.id
            TodoTask.findByIdAndUpdate(
                id,
                {
                    title: req.body.title,
                    content: req.body.content
                },
                err => {
                    if (err) return res.status(500).send({message: err.message})
                    res.redirect('/')
                }
            )
        })

//DELETE
app
        .route('/remove/:id')
        .get ((req, res) => {
            const id = req.params.id
            TodoTask.findByIdAndRemove(id, err => {
                if (err) return res.status(500).send({message: err.message})
                    res.redirect('/')
            })
        })

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on ${PORT}`)
}
)