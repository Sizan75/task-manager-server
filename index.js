const express=require('express')
const cors=require('cors')
const app= express()
const port= process.env.PORT || 5000;

require('dotenv').config()
app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bahxlpw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const foodCollection= client.db('happilyfreshdb').collection('foodservice')
        const reviewCollection= client.db('happilyfreshdb').collection('review')
    
        
        app.get('/myreviews',async(req,res)=>{
           
            let query = {};
    
            if (req.query.userEmail) {
                query = {
                    userEmail: req.query.userEmail
                }
            }
            const cursor = reviewCollection.find(query);
            const myreview = await cursor.toArray();
            res.send(myreview);
        })
    
        
    
        app.post('/foodservices', async(req,res)=>{
            const food=req.body
            const result = await foodCollection.insertOne(food)
            res.send(result)
        })
    
        app.put('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const newrev = req.body;
            const option = {upsert: true};
            const updatedreview = {
                $set: {
                    review: newrev.review,
                    
                }
            }
            const result = await reviewCollection.updateOne(filter, updatedreview, option);
            res.send(result);
        })
    
        app.delete('/reviews/:id',async(req,res)=>{
            const id=req.params.id
            const query={_id: ObjectId(id)}
            const result = await reviewCollection.deleteOne(query)
            res.send(result)
           }) 
    }
    finally{
    
    }
    }
    run().catch(error=>console.error(error))

    app.get('/',(req,res)=>{
        res.send('happily fresh server running')
    })
    
    app.listen(port, ()=>{
        console.log(`happily Fresh server running in port ${port}` )
    
    })