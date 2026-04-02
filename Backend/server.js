const connectDB = require('./src/config/db');

const { app, server } = require('./src/app');

const PORT = process.env.PORT || 5000;

connectDB();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});