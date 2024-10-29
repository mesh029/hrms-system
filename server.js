import express from 'express';
import { adminMiddleware, authenticateJWT } from './server/middlewares/authMiddleWare.js';
import { createUser, getUsers, getUserById, updateUser, deleteUser, login } from './server/controllers/userController.js';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';



const app = express();
const PORT = process.env.PORT || 3030;
const prisma = new PrismaClient();
// Middleware to parse JSON request bodies
app.use(express.json());
// Route to log in and get a JWT token
app.post('/login', login);

// Middleware to authenticate JWT
app.use(authenticateJWT); 
// Routes
app.post('/api/users', adminMiddleware, createUser); // Ensure only admin can create users
app.get('/api/users', getUsers);
app.get('/api/users/:id', getUserById);
app.put('/api/users/:id', updateUser);
app.delete('/api/users/:id', deleteUser);


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
