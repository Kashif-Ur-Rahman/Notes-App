import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticateToken } from "./middleware/auth"; // middleware for auth

const app = express();
const prisma = new PrismaClient();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ===================== Notes Routes ===================== //

// GET all notes
app.get("/api/notes", authenticateToken, async (req: Request, res: Response) => {
    const notes = await prisma.note.findMany({
        where: { userId: (req as any).user.userId },
    });
    res.json(notes);
});

// POST a note
app.post("/api/notes", authenticateToken, async (req: Request, res: Response) => {
    const { title, content, tags } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: "Title and content required" });
    }

    const newNote = await prisma.note.create({
        data: {
            title,
            content,
            tags: tags || "",  // store tags as string
            userId: (req as any).user.userId,
        },
    });

    res.status(201).json(newNote);
});


// PUT - Full Update
app.put("/api/notes/:id", authenticateToken, async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { title, content, tags } = req.body;

    try {
        const updatedNote = await prisma.note.update({
            where: { id },
            data: { title, content, tags: tags || "" },
        });
        res.json(updatedNote);
    } catch {
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

// ===================== User Auth Routes ===================== //

// Sign Up
app.post("/api/signup", async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: { name, email, password: hashedPassword },
    });

    res.json(newUser);
});

// Login
app.post("/api/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, "your-secret-key", { expiresIn: "1h" });
    res.json({ token });
});

// Get User Profile
app.get("/api/profile", authenticateToken, async (req: any, res: any) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { id: true, name: true, email: true, createdAt: true },
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile" });
    }
});


// ===================== Start Server ===================== //
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
