import { Request, Response } from 'express';
import poolDB from '../config/db';

// Register a user for an event
export const registerForEvent = async (req: Request, res: Response): Promise<void> => {
  const { userId, eventId } = req.body;

  try {
    // Check if the user is already registered for the event
    const existingRegistrationQuery = `
      SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2
    `;
    const existingRegistrationResult = await poolDB.query(existingRegistrationQuery, [userId, eventId]);

    if (existingRegistrationResult.rows.length > 0) {
      res.status(400).json({ error: 'User is already registered for this event' });
      return;
    }

    // Insert the registration into the database
    const insertRegistrationQuery = `
      INSERT INTO registrations (user_id, event_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await poolDB.query(insertRegistrationQuery, [userId, eventId]);

    res.status(201).json({ message: 'Registration successful', registration: result.rows[0] });
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ error: 'Failed to register for event' });
  }
};

// Get all registrations for a specific event
export const getRegistrationsForEvent = async (req: Request, res: Response): Promise<void> => {
  const { eventId } = req.params;

  try {
    const query = `
      SELECT 
        r.id AS registration_id,
        r.registered_at,
        u.id AS user_id,
        u.name AS user_name,
        e.id AS event_id,
        e.title AS event_title
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      JOIN events e ON r.event_id = e.id
      WHERE r.event_id = $1
    `;
    const result = await poolDB.query(query, [eventId]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
};
