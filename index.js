const express = require('express')
const app = express()
const port = 5000
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId;



const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vz7f0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// const uri = "mongodb+srv://<username>:<password>@cluster0.vz7f0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const AllBlogs = client.db("blog").collection("blogList");
  const AllComments = client.db("blog").collection("allComments");
  console.log("Database connected");

  app.post('/addBlog', (req, res) => {
    const newBlog = req.body;

    console.log('adding new blog', newBlog);
    AllBlogs.insertOne(newBlog)

      .then(result => {
        console.log('in', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })


  app.get('/allBlogs', (req, res) => {

    AllBlogs.find()
      .toArray((err, items) => {
        res.send(items);

      })
  })

  app.patch('/addComments/:id', (req, res) => {

    console.log(req.params.id);
    AllBlogs.findOneAndUpdate({ _id: objectId(req.params.id) }, {
      $push: { comments: req.body.comment }
    })

      .then(result => {
        console.log('in', result.insertedCount);
        res.send(result.insertedCount > 0)
      })

  })

  app.patch("/addLikes/:id", (req, res) => {
    console.log(req.params.id);
    console.log(req.body.data);
    AllBlogs.findOneAndUpdate({ _id: objectId(req.params.id) }, {
      $push: { upVote: req.body.data }
    })

      .then(result => {
        console.log('in', result.insertedCount);
        res.send(result.insertedCount > 0)
      })

  })

  app.patch("/addDownVote/:id",(req,res)=>{
    console.log(req.params.id);
    console.log(req.body.data);
    AllBlogs.findOneAndUpdate({ _id: objectId(req.params.id) }, {
      $push: { downVote: req.body.data }
    })

      .then(result => {
        console.log('in', result.insertedCount);
        res.send(result.insertedCount > 0)
      })


  })
  //   client.close();
});

app.get('/', (req, res) => {
  res.send('Hello Good Peoples')
})

app.listen(process.env.PORT || port);