const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

(async () => {

const url = 'mongodb+srv://admin:VomqY7i4YacrY8kC@cluster0.3yrpj.mongodb.net/ocean_db?retryWrites=true&w=majority';

const dbName = 'ocean_db';

//const url = 'mongodb+srv://admin:MVhyXlPJWaD2Cfbq@cluster0.7fu0x.mongodb.net/ocean_db?retryWrites=true&w=majority';

//const dbName = 'ocean_db';


console.info('Conectando ao banco de dados...');

const client = await MongoClient.connect(url, { useUnifiedTopology: true });

console.info('MongoDB conectado com sucesso!!');

const db = client.db(dbName);

const app = express();

app.use(express.json());

app.get('/hello', function (req, res) {
  res.send('Hello World');
});

const mensagens = ['Essa é a primeira mensagem!', 'Essa é a segunda mensagem!'];

const mensagensCollection = db.collection('mensagens');

// CRUD (Create, Read, Update, Delete)

// GET: READ ALL (exibir todos os registros)
app.get('/mensagens', async (req, res) => {
  const listaMensagens = await mensagensCollection.find().toArray();

  res.send(listaMensagens);
});

// GET: READ SINGLE (exibir apenas um registro)
app.get('/mensagens/:id', async (req, res) => {
  const id = req.params.id;

  const mensagem = await mensagensCollection.findOne({_id: ObjectId(id) });

  if (!mensagem) {
    res.send('Mensagem não encontrada.');
  }

  res.send(mensagem);
});

// POST: CREATE (criar um registro)
app.post('/mensagens', async (req, res) => {
  const mensagem = req.body;

  await mensagensCollection.insertOne(mensagem);

  res.send(mensagem);

  const id = mensagens.length;

  res.send(`Mensagem '${id}' criada com sucesso.`);
});

// PUT: UPDATE (editar um registro)
app.put('/mensagens/:id', async (req, res) => {
  const id = req.params.id;

  const mensagem = req.body;

  await mensagensCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: mensagem }
  );

  mensagens[id] = mensagem;

  res.send('Mensagem atualizada com sucesso.');
});

// DELETE: DELETE (remover um registro)
app.delete('/mensagens/:id', async (req, res) => {
  const id = req.params.id;

  await mensagensCollection.deleteOne({ _id: ObjectId(id) });

  delete mensagens[id];

  res.send('Mensagem removida com sucesso.');
});

app.listen(process.env.PORT || 3000);

})();
