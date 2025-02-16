const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://vennelasushmavelagapudi:12345@cluster0.eqex4.mongodb.net/language_learning_app?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error: ', err));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Create a User Model
const User = mongoose.model('User', userSchema);

// Endpoint to handle the form submission (Signup)
app.post('/signup', async (req, res) => {
    const { username, fullName, email, password } = req.body;

    try {
        const newUser = new User({ username, fullName, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
        res.status(400).json({ error: 'Error creating user: ' + error.message });
    }
});

// Endpoint to handle login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Compare plain text password with the one stored in the database
        if (user.password !== password) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Return success message with user details (you can add JWT or session token for authentication)
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// Set up server to listen on port
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
