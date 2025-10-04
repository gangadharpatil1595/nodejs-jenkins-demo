const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🚀 Hello from Node.js App deployed with Jenkins CI/CD!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
