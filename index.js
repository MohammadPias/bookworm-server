const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const port = '5000';

const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.o4muq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const database = client.db("bookworm");
        const userCollection = database.collection('user')

        // add user to database
        app.post('/user', async (req, res) => {
            const data = req.body;
            const result = userCollection.insertOne(data)
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
};
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Welcome to BookWorm server')
});
app.listen(port, () => {
    console.log('listening port', port)
})