const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());





app.use('/api/auth', require('./routes/auth'));
app.use('/api/farmers', require('./routes/farmers'));
app.use('/api/crops', require('./routes/crops'));
app.use('/api/fertilizers', require('./routes/fertilizers'));
app.use('/api/yields', require('./routes/yields'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/faqs', require('./routes/faqs'));
app.use('/api/feedback', require('./routes/feedback'));


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});