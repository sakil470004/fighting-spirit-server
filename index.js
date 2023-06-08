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
        const classesCollection = client.db('fighting-spirit').collection('classes');
        const instructorsCollection = client.db('fighting-spirit').collection('instructors');
        const usersCollection = client.db('fighting-spirit').collection('users');
        // classes
        app.get('/classes', async (req, res) => {
            const result = await classesCollection.find().toArray();
            res.send(result)
        })
        // instructors
        app.get('/instructors', async (req, res) => {
            const result = await instructorsCollection.find().toArray();
            res.send(result)
        })
        // users
        app.post('/users', async (req, res) => {
            const user = req.body;
            // console.log(user)
            const query = { email: user.email }
            const currentUser = await usersCollection.findOne(query);
        //    console.log(currentUser)
            if (currentUser) {
                res.send({})
            } else {
                const result = await usersCollection.insertOne(user)
                res.send(result)
            }
        })

        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result)
        })


    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello From Fighting Spirit server!');
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
