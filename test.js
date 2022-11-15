const mongodb = require('mongodb');
const client = mongodb.MongoClient;
const objectID = mongodb.ObjectId;

const connectionUrl = 'mongodb://127.0.0.1:27017';
const database = 'task-manager';
client.connect(connectionUrl, {useNewUrlParser: true}, (error, response) => {
    if (error) {
        return console.log('unable to connect to the database');
    } 
    
    const db = response.db(database);

    // db.collection('users').insertMany([
    //     {
    //         name: 'Ahmed',
    //         age: 29
    //     },
    //     {
    //         name: 'Nayon',
    //         age: 16
    //     }
    // ], (err, res) => {
    //     console.log('err', err);
    //     console.log('res', res);
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'taks one',
    //         completed: true
    //     },
    //     {
    //         description: 'taks two',
    //         completed: false
    //     }
    // ], (err, res) => {
    //     console.log('err', err);
    //     console.log('res', res);
    // })

    // db.collection('users').findOne({name:'Naeem'}, (error, res) => {
    //     if (error) {
    //         return console.log('error', error);
    //     }

    //     console.log('res', res);
    // })


    // db.collection('users').find({name:'Naeem'}).toArray((error, res) => {
    //     if (error) {
    //         return console.log('error', error);
    //     }

    //     console.log('count', res.length);
    //     console.log('res', res);
    // })

    db.collection('users').deleteMany({
        age: 28
    }).then((res)=>{
        console.log('data', res);
    })
    .catch((error)=>{
        console.log('error', error);
    })
})