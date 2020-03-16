import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes';
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(routes)

app.listen(3001, function () {
  console.log('Starting on port 3001');
});
