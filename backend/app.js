const express = require('express');
const cors = require('cors');
const codeBlockRoutes = require('./routes/codeBlocks');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/codeblocks', codeBlockRoutes);

module.exports = app;
