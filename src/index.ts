import express, { Express } from 'express';
import cors from 'cors';
import graphRoutes from './routes/graph.route';
import config from './config';
import path from 'path';

const app: Express = express();

app.use(express.json());
app.use(config.api.prefix, graphRoutes);
app.use(cors());
app.use(express.static(path.join(__dirname, "../public"))); // serve frontend


app.listen(config.server.port, () => {
  console.log(`Server running at http://localhost:${config.server.port}`);
  console.log(`Environment: ${config.server.nodeEnv}`);
  console.log(`API prefix: ${config.api.prefix}`);
});