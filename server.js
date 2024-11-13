const config = require('./config/config');
const app = require('./app');
const PORT = config.port || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
