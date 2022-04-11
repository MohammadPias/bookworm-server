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
        const bookCollection = database.collection('books');
        const orderCollection = database.collection('orders');

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
            console.log(idDigit)
            let books = [];
            if (idDigit > 5) {
                const query = { _id: ObjectId(id) };
                books = await bookCollection.findOne(query);
            }
            else {

                const query = { category: id }
                const cursor = bookCollection.find(query);
                books = await cursor.toArray();
            }

            res.json(books)
        });

        // get books by cart
        app.post('/books/keys', async (req, res) => {
            const keys = req.body;
            console.log(keys)

            const objArray = [];
            if (keys.length) {
                for (const key of keys) {
                    objArray.push(ObjectId(key))
                }
            }
            console.log(objArray)

            const query = { _id: { $in: objArray } };
            const result = await bookCollection.find(query).toArray();
            console.log(result)
            res.json(result)

        });

        // add orders to db
        app.post('/orders', async (req, res) => {
            const orders = req.body;
            const result = await orderCollection.insertOne(orders);
            res.send(result)
        });

        // find orders by email
        app.get('/orders/:id', async (req, res) => {
            const email = req.params.id;
            console.log('hitting the post', email)
            const query = { email: email };
            const cursor = orderCollection.find(query);
            console.log(cursor)
            const result = await cursor.toArray();
            console.log(email, result);
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
});

