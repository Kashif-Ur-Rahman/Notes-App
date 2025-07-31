import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// GET all notes
app.get("/api/notes", async (req: Request, res: Response) => {
    const notes = await prisma.note.findMany();
    res.json(notes);
});

// POST a note
app.post("/api/notes", async (req: Request, res: Response) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: "Title and content required" });
    }

    const newNote = await prisma.note.create({
        data: { title, content },
    });

    res.status(201).json(newNote);
});

// PUT - Full Update
app.put("/api/notes/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: "Title and content required" });
    }

    try {
        const updatedNote = await prisma.note.update({
            where: { id },
            data: { title, content },
        });
        res.json(updatedNote);
    } catch (error) {
        res.status(404).json({ message: "Note not found" });
    }
});

// PATCH - Partial Update
app.patch("/api/notes/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { title, content } = req.body;

    try {
        const updatedNote = await prisma.note.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(content && { content }),
            },
        });
        res.json(updatedNote);
    } catch (error) {
        res.status(404).json({ message: "Note not found" });
    }
});


// DELETE a note
app.delete("/api/notes/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await prisma.note.delete({ where: { id } });
    res.json({ message: "Note deleted" });
});

app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
);
