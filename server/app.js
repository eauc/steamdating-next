import express from 'express';
import consign from 'consign';

const app = express();

consign({
  cwd: 'server',
  verbose: process.env.NODE_ENV !== 'production'
}).include('config.js')
  .then('libs')
  .then('routes')
  .then('boot.js')
  .into(app);
