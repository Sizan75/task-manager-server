const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bahxlpw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const taskCollection = client.db('taskManager').collection('tasks')
        const usersCollection = client.db('taskManager').collection('users')

        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })

        app.post('/tasks', async (req, res) => {
            const tasks = req.body;
            const result = await taskCollection.insertOne(tasks);
            res.send(result);
        })

        app.get('/mytasks', async (req, res) => {

            let query = {};

            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = taskCollection.find(query);
            const mytask = await cursor.toArray();
            res.send(mytask);
        })

        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await taskCollection.deleteOne(query)
            res.send(result)
        })

        app.get('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.findOne(query);
            res.send(result);
        })

        app.put('/update/:id', async(req,res)=>{
            const id = req.params.id;
            const updatedTask = req.body;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: updatedTask.name,
                    
                }
            }
            const result = await taskCollection.updateOne(filter, updatedDoc, option)
            res.send(result);
        })

     

        app.put('/complete/:id', async(req,res)=>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updatedDoc = {
                $set: {
                    completeStatus: true,
                }
            }
            const result = await taskCollection.updateOne(filter, updatedDoc, option)
            res.send(result);
        })

        app.get('/completetask', async (req, res) => {
            const email = req.query.email;
            const query = { 
                email : email,
                completeStatus : true,
            };
            const result = await taskCollection.find(query).toArray();
            res.send(result);
        })
        
    }
    finally {

    }
}
run().catch(error => console.error(error))

app.get('/', (req, res) => {
    res.send('Task Manager server running')
})

app.listen(port, () => {
    console.log(`task manager server running in port ${port}`)

})