const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let users = [];

app.use((req, res, next) => {
    const currentTime = new Date().toISOString();
    console.log(`Request received at: ${currentTime}`);
    console.log(`${req.method} ${req.url}`);
    next();
});

const jsonResponse = (res, message, status = 200, extraData = {}) => {
    return res.status(status).json({
        message: message,
        time: new Date().toISOString(),
        ...extraData
    });
};

app.get('/', (req, res) => {
    jsonResponse(res, "Server Running");
});

app.get('/users', (req, res) => {
    res.status(200).json({
        users: users,
        time: new Date().toISOString()
    });
});

app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return jsonResponse(res, "User not found", 404);
    
    res.status(200).json({
        user: user,
        time: new Date().toISOString()
    });
});

app.post('/users', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return jsonResponse(res, "Name and email are required", 400);
    }

    const emailExists = users.some(u => u.email === email);
    if (emailExists) {
        return jsonResponse(res, "Email already exists", 400);
    }

    const newUser = {
        id: users.length + 1,
        name,
        email
    };

    users.push(newUser);
    jsonResponse(res, "User added successfully", 201, { user: newUser });
});

app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return jsonResponse(res, "User not found", 404);
    }

    users.splice(userIndex, 1);
    jsonResponse(res, "User deleted successfully");
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return jsonResponse(res, "All fields required", 400);
    }

    if (email === "admin@gmail.com" && password === "1234") {
        jsonResponse(res, "Login Success");
    } else {
        jsonResponse(res, "Invalid Credentials", 401);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});