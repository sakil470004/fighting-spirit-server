const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000
const app = express();

// Use cors middleware to enable CORS
app.use(cors())
app.use(express.json()); // Middleware to parse JSON request body
// for environment variable
require('dotenv').config()




const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASS}@cluster0.bpciahf.mongodb.net/?retryWrites=true&w=majority`;

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
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();
        console.log('mongo Connected Successfully')
        const initialToyCollection = client.db('battle-toys').collection('toys');
        const toyCollection = client.db('battle-toys').collection('user-toys');
        // initital Toys
        app.get('/initialToys', async (req, res) => {
            const result = await initialToyCollection.find().toArray();
            res.send(result)
        })
        app.get('/singleInitialToy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await initialToyCollection.findOne(query);
            res.send(result)
        })
        // get total toysNumber
        app.get('/totalToys', async (req, res) => {
            const result = await toyCollection.find().toArray();
            res.send({ totalToys: result.length, allToys: result })
        })

        //todo: user toys//uses limit
        app.get('/allToys', async (req, res) => {
            // console.log(req.query);
            const page = parseInt(req.query.page) || 0;
            const limit = parseInt(req.query.limit) || 10;
            const skip = page * limit;
            const result = await toyCollection.find().skip(skip).limit(limit).toArray();
            res.send(result)
        })
        app.get('/myToys', async (req, res) => {
            // console.log(req.params)
            const email = req.query.email;
            let query = {}
            if (email) {
                query = { sellerEmail: email };
            }
            // console.log(email,query)
            const result = await toyCollection.find(query).toArray();
            res.send(result)
        })
        // get single Toy with id
        app.get('/singleToy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toyCollection.findOne(query);
            res.send(result);
        })
        app.get('/latest', async (req, res) => {
            const result = await toyCollection
                .find()
                .sort({ _id: -1 }) // Sort in descending order based on the _id field
                .limit(3) // Limit the result to three documents
                .toArray()
            res.send(result);
        })
        // add a toy
        app.post('/addToys', async (req, res) => {
            const toys = req.body;
            // console.log(toys)
            const result = await toyCollection.insertOne(toys);
            res.send(result)
        })
        // todo:update a toy
        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const toy = req.body;
            const result = await toyCollection.updateOne({ _id: new ObjectId(id) }, {
                $set: toy
            })
            res.send(result);
        })
        // delete a toy
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toyCollection.deleteOne(query);
            res.send(result)
        })
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello From Battle Toys server!');
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
