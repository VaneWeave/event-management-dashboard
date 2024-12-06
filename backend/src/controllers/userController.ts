import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import poolDB from "../config/db";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Sign up a new user
export const signUp = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, isAdmin } = req.body;
  
    try {
      // Validate required fields
      if (!name || !email || !password) {
        res.status(400).json({ error: "Name, email, and password are required" });
        return;
      }
  
      // Check if the email is already in use
      const existingUserQuery = "SELECT * FROM users WHERE email = $1";
      const existingUserResult = await poolDB.query(existingUserQuery, [email]);
  
      if (existingUserResult.rows.length > 0) {
        res.status(400).json({ error: "Email is already registered" });
        return;
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert the new user into the database
      const insertUserQuery = `
        INSERT INTO users (name, email, password, is_admin)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, is_admin
      `;
      const newUserResult = await poolDB.query(insertUserQuery, [
        name,
        email,
        hashedPassword,
        isAdmin ?? false,
      ]);
  
      const newUser = newUserResult.rows[0];
  
      // Create a JWT token
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          isAdmin: newUser.is_admin,
        },
        token,
      });
      return;
    } catch (error: any) {
      console.error("Error during sign up:", error.message || error);
      res.status(500).json({ error: "Failed to register user" });
      return;
    }
  };
  

// Login a user
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        // Validate required fields
        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
            return;
        }

        // Fetch the user by email
        const userQuery = "SELECT * FROM users WHERE email = $1";
        const userResult = await poolDB.query(userQuery, [email]);

        if (userResult.rows.length === 0) {
            res.status(400).json({ error: "Invalid email or password" });
            return;
        }

        const user = userResult.rows[0];

        // Compare the password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(400).json({ error: "Invalid email or password" });
            return;
        }

        // Create a JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.is_admin,
            },
            token,
        });
        return; // Explicitly end the function
    } catch (error: any) {
        console.error("Error during login:", error.message || error);
        res.status(500).json({ error: "Failed to login" });
        return;
    }
};
