const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/quiz-maker', { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const QuizSchema = new mongoose.Schema({
    title: String,
    questions: Array,
});

const User = mongoose.model('User', UserSchema);
const Quiz = mongoose.model('Quiz', QuizSchema);

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.send('User registered!');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id }, 'secret');
        res.json({ token });
    } else {
        res.send('Invalid credentials');
    }
});

app.post('/quizzes', async (req, res) => {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.send('Quiz created!');
});

app.get('/quizzes', async (req, res) => {
    const quizzes = await Quiz.find();
    res.json(quizzes);
});

app.get('/quizzes/:id', async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    res.json(quiz);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
