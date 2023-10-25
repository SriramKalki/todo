const express = require('express');
const router = express.Router();
const Task = require('../models/Task'); // Import your Mongoose Task model

// Create a new task
router.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// // Retrieve all tasks
// router.get('/tasks', async (req, res) => {
//   try {
//     const tasks = await Task.find();
//     res.json(tasks);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

router.get('/tasks', async (req, res) => {
    try {
      let query = Task.find(); // Start with a basic query
  
      if (req.query.sort === 'title') {
        query = query.sort({ name: 1 }); // Sort by task title in ascending order
      } else if (req.query.sort === 'createdAt') {
        query = query.sort({ createdAt: -1 }); // Sort by creation date in descending order (newest to oldest)
      } else {
        query = query.sort({ dueDate: 1 }); // Sort by due date in ascending order (closest first)
      }
  
      const tasks = await query.exec();
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


// Retrieve a single task by ID
router.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a task by ID
router.put('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete a task by ID
router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    return res.json({message: 'Task Deleted'});
  } catch (error) {
    res.status(500).send(error);
  }
});

// // Delete all tasks
// router.delete('/tasks', async (req, res) => {
//     try {
//       // Use the remove or delete method provided by your database or ORM to delete all tasks
//       // For example, if you're using Mongoose, it might look like this:
//       await Task.deleteMany({});
//       res.json({ message: 'All tasks deleted successfully' });
//     } catch (error) {
//       res.status(500).send(error);
//     }
//   });

module.exports = router;
