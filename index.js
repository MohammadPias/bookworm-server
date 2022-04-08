const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
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
        const userCollection = database.collection('user');
        const bookCollection = database.collection('books')

        // add user to database
        app.post('/user', async (req, res) => {
            const data = req.body;
            const result = await userCollection.insertOne(data)
            res.json(result);
        });
        // add books to db
        app.post('/books', async (req, res) => {
            const book = req.body;
            const result = await bookCollection.insertOne(book);
            console.log(result)
            res.json(result);
        });
        // get all books
        app.get('/books', async (req, res) => {
            const cursor = bookCollection.find({});
            const result = await cursor.toArray();

            res.send(result)
        });
        // get books by id
        app.get('/books/:id', async (req, res) => {
            const id = req.params.id;
            const idDigit = id.toString().length;
            let books = [];

            if (idDigit > 100) {
                const query = { _id: ObjectId(id) };
                const result = await bookCollection.findOne(query);
            }
            else {

                const query = { category: id }
                const cursor = bookCollection.find(query);
                books = await cursor.toArray();
                console.log('hitting the get method by category', books)
            }

            res.json(books)
        });
        // get books by category
        // app.get('/books/:id')
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
});

