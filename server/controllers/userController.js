// userController.js

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 
import dotenv from 'dotenv';

dotenv.config()
const prisma = new PrismaClient();


// Create a new user
export const createUser = async (req, res) => {
    const { name, email, password, role, department, address, hireDate, endDate, reportsTo, manager, weight, height, leaveDays } = req.body;

    // Generate a default password for the new user
const generateDefaultPassword = () => {
    return 'password123'; // You can modify this as needed, or make it random
};

try {
    // Use default password if no password is provided
    const finalPassword = password || generateDefaultPassword();

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    // Create the user in the database
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
            department,
            address,
            hireDate,
            endDate,
            reportsTo,
            manager,
            weight,
            height,
            leaveDays,
            // Set password reset fields to null at creation
            passwordResetToken: null,
            passwordResetTokenExpiry: null,
        },
    });

    // Send the default password back to the admin
    res.status(201).json({
        message: "User created successfully",
        newUser,
        defaultPassword: finalPassword, // send default password
    });
} catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
}
};




// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};

// Get a user by ID
export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
};

// Update a user
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role, department } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { name, email, role, department },
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.user.delete({
            where: { id: Number(id) },
        });
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
};


//login


// Secret key for signing JWTs
const JWT_SECRET = process.env.JWT_SECRET// Replace with your own secret key

// Function to log in and get a JWT token
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // If user not found or password does not match
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Create a JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: '1h', // Token expiration time
        });

        res.json({ token }); // Send token back to the client
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
        console.log(error)
    }
};

// timesheetController.js


// Assuming you have a route to handle submitting a timesheet for a month
export const submitTimesheet = async (req, res) => {
    try {
        const { userId, year, month, entries, status } = req.body;

        // Validate entries
        if (!entries || !Array.isArray(entries) || entries.length === 0) {
            return res.status(400).json({ error: 'Invalid timesheet entries' });
        }

        // Ensure all days of the month are accounted for
        const daysInMonth = new Date(year, month, 0).getDate();
        //if (entries.length !== daysInMonth) {
         //   return res.status(400).json({ error: 'Entries count does not match the number of days in the month' });
        //}

        // Create the Timesheet
        const timesheet = await prisma.timesheet.create({
            data: {
                userId,
                year,
                month,
                status,
                entries: {
                    create: entries.map(entry => ({
                        date: new Date(entry.date), // Store each date correctly
                        hours: parseFloat(entry.hours), // Store hours as float
                        type: entry.type, // 'Regular', 'Holiday', etc.
                        description: entry.description, // Optional description
                    }))
                }
            }
        });

        res.status(201).json({
            message: 'Timesheet submitted successfully',
            timesheet: timesheet,
        });
    } catch (error) {
        console.error('Error submitting timesheet:', error);
        res.status(500).json({ error: 'Error submitting timesheet' });
    }
};


export const getTimesheetsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const timesheets = await prisma.timesheet.findMany({
            where: { userId: parseInt(userId, 10) },
            orderBy: { date: 'asc' }, // Sort by date
        });

        res.json(timesheets);
    } catch (error) {
        console.error('Error fetching timesheets:', error);
        res.status(500).json({ error: 'Error fetching timesheets' });
    }
};
