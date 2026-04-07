const Task = require('../models/Task');

// 1. Create Task
exports.createTask = async (req, res) => {
  try {
    const newTask = new Task({ ...req.body, user: req.user.id });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

// 2. Read All Tasks (Sirf login user ke)
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// 3. Update Task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, 
      req.body, 
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

// 4. Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};