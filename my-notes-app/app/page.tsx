"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [notes, setNotes] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetch("/api/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data));
  }, []);

  const addNote = async () => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const newNote = await res.json();
    setNotes([...notes, newNote]);
    setText("");
  };

  const deleteNote = async (id: number) => {
    const res = await fetch("/api/notes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setNotes(notes.filter((note) => note.id !== id));
    }
  };

  const startEdit = (note: any) => {
    setEditId(note.id);
    setEditText(note.text);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  const saveEdit = async () => {
    if (editId === null) return;
    const res = await fetch("/api/notes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editId, text: editText }),
    });
    if (res.ok) {
      const updated = await res.json();
      setNotes(notes.map((note) => (note.id === editId ? updated : note)));
      cancelEdit();
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Notes App</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-grow rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a note"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addNote}
        >
          Add
        </button>
      </div>
      <ul>
        {notes.map((note) => (
          <li key={note.id} className="border p-2 mb-2 rounded flex items-center justify-between gap-2">
            {editId === note.id ? (
              <>
                <input
                  className="border p-1 rounded flex-grow"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={saveEdit}>Save</button>
                <button className="bg-gray-400 text-white px-2 py-1 rounded" onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <span className="flex-grow">{note.text}</span>
                <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={() => startEdit(note)}>Edit</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => deleteNote(note.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
