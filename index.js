const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_U}:${process.env.DB_P}@cluster0.rohhp7w.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    let memberCollection = client.db('Spot').collection('member');

    app.post('/member', async (req, res)=>{
        let user = req.body;
        let query = {email : user.email};
        let oldUser = await memberCollection.findOne(query);
        if(oldUser){
          return
        }
        let result = await memberCollection.insertOne(user);
        res.send(result);
        
      })

      app.get('/members', async (req, res)=>{
        let result = await memberCollection.find().toArray()
        res.send(result)
      })

      app.put('/status', async (req, res)=>{
        let email = req.query.email
        let query = {email : email};
        let options = { upsert: true };
        let updateStatus = {
          $set: {
            status : 'At Spot'
          }
        }
        let result = await memberCollection.updateOne(query, updateStatus, options)
        res.send(result);
        
      })
      app.put('/status1', async (req, res)=>{
        let email = req.query.email
        let query = {email : email};
        let options = { upsert: true };
        let updateStatus = {
          $set: {
            status : 'Not At Spot'
          }
        }
        let result = await memberCollection.updateOne(query, updateStatus, options)
        res.send(result);
        
      })



    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})