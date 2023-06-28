import express from 'express';
import payload from 'payload';
import cors from 'cors';

require('dotenv').config();
const app = express();

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin');
});

const start = async () => {
  app.use(cors({
    origin: 'http://localhost:3000',  
    credentials: true, 
  }));

  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.MONGODB_URI,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  app.use(payload.authenticate);

  app.listen(3000);
}

start();
