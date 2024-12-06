import { Request, Response } from "express";
import poolDB from "../config/db";

export const getAllEvents = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const query = "SELECT * FROM events";
        const result = await poolDB.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Failed to fetch events" });
    }
};

export const createEvent = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { title, description, date, location, photoLink, createdBy } =
        req.body;

    try {
        const query = `
        INSERT INTO events (title, description, date, location, photo_link, created_by)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
        const values = [
            title,
            description,
            date,
            location,
            photoLink,
            createdBy,
        ];
        const result = await poolDB.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ error: "Failed to create event" });
    }
};

export const deleteEvent = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id } = req.params;

    try {
        const query = "DELETE FROM events WHERE id = $1 RETURNING *";
        const result = await poolDB.query(query, [id]);

        if (result.rowCount === 0) {
            res.status(404).json({ error: "Event not found" });
            return;
        }

        res.status(200).json({
            message: "Event deleted successfully",
            event: result.rows[0],
        });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ error: "Failed to delete event" });
    }
};
