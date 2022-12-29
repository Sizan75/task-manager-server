const express=require('express')
const cors=require('cors')
const app= express()
const port= process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bahxlpw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const taskCollection= client.db('taskManager').collection('tasks')
        const usersCollection= client.db('taskManager').collection('users')
    
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

        app.get('/mytasks',async(req,res)=>{
       
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
    
        app.delete('/tasks/:id',async(req,res)=>{
            const id=req.params.id
            const query={_id: ObjectId(id)}
            const result = await taskCollection.deleteOne(query)
            res.send(result)
           }) 

    }
    finally{
    
    }
    }
    run().catch(error=>console.error(error))

    app.get('/',(req,res)=>{
        res.send('Task Manager server running')
    })
    
    app.listen(port, ()=>{
        console.log(`task manager server running in port ${port}` )
    
    })