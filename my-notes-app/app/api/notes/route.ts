import { NextResponse } from "next/server";

let notes: { id: number; text: string }[] = [];

export async function GET() {
    return NextResponse.json(notes);
}

export async function POST(req: Request) {
    const body = await req.json();
    const newNote = { id: Date.now(), text: body.text };
    notes.push(newNote);
    return NextResponse.json(newNote, { status: 201 });
}

export async function PUT(req: Request) {
    const body = await req.json();
    const { id, text } = body;
    const note = notes.find((n) => n.id === id);
    if (!note) {
        return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
    note.text = text;
    return NextResponse.json(note);
}

export async function DELETE(req: Request) {
    const body = await req.json();
    const { id } = body;
    const index = notes.findIndex((n) => n.id === id);
    if (index === -1) {
        return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
    const deleted = notes.splice(index, 1)[0];
    return NextResponse.json(deleted);
}
