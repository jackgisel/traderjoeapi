const functions = require('firebase-functions'); // create functions
const admin = require('firebase-admin'); // functions can access firebase backend
const express = require('express'); // creates a server instance
const cors = require('cors'); // allows your functions to run somewhere separate
const app = express();
app.use(cors({ origin: true }));

var serviceAccount = require('./permissions.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://groceasy-ec29b.firebaseio.com'
});

const db = admin.firestore();

// read all recipes
app.get('/api/recipes', (req, res) => {
  (async () => {
    try {
      let query = req.query.tag
        ? db
            .collection('recipe')
            .where('tagIds', 'array-contains', Number(req.query.tag))
        : db.collection('recipe');
      let response = [];
      await query
        .get()
        .then(querySnapshot => {
          let docs = querySnapshot.docs;
          for (let doc of docs) {
            const selectedItem = {
              ...doc.data(),
              id: doc.id
            };
            response.push(selectedItem);
          }
          return docs;
        })
        .catch(err => console.log(err));
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// read recipe by id
app.get('/api/recipes/:recipe_id', (req, res) => {
  (async () => {
    try {
      let response = [];
      await db
        .collection('recipe')
        .doc(req.params.recipe_id)
        .get()
        .then(doc => {
          if (!doc.exists) {
            return 'Does not exist';
          } else {
            response.push({ id: doc.id, ...doc.data() });
            return { ...doc.data() };
          }
        })
        .catch(err => console.log(err));
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// read all tags
app.get('/api/tags', (req, res) => {
  (async () => {
    try {
      let query = db.collection('tag');
      let response = [];
      await query
        .get()
        .then(querySnapshot => {
          let docs = querySnapshot.docs;
          for (let doc of docs) {
            const selectedItem = {
              ...doc.data(),
              id: doc.id
            };
            response.push(selectedItem);
          }
          return docs;
        })
        .catch(err => console.log(err));
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// read tag by id
app.get('/api/tags/:tag_id', (req, res) => {
  (async () => {
    try {
      let response = [];
      await db
        .collection('tag')
        .doc(req.params.tag_id)
        .get()
        .then(doc => {
          if (!doc.exists) {
            return 'Does not exist';
          } else {
            response.push({ id: doc.id, ...doc.data() });
            return { ...doc.data() };
          }
        })
        .catch(err => console.log(err));
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

exports.app = functions.https.onRequest(app);
