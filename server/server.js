const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 5500;
const TodoItemRoute = require('./routes/Task');
var cors = require('cors')

app.use(cors()) // Use this after the variable declaration
// Connect to your MongoDB database
mongoose.connect("mongodb+srv://sriramkalki007:kudesign@todo.yvgwwl4.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import and use your API routes
app.use(express.json()); // Parse JSON request bodies
app.use('/api', TodoItemRoute);


app.get('/', (req, res) => {
    res.send('Hello, World');
  });
  
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
