const express = require('express');
const app = express();
const ipRoutes = require('./routes/ipRoutes');

const PORT = process.env.PORT || 3000;


app.use(express.json());

app.use('/api/ip', ipRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
