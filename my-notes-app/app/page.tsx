"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // GET all notes
  useEffect(() => {
    fetch("http://localhost:5000/api/notes")
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(err => console.error("Error fetching notes:", err));
  }, []);

  // ADD a new note
  const addNote = async () => {
    if (!title || !content) return alert("Both title and content required");

    const res = await fetch("http://localhost:5000/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) return alert("Failed to add note");

    const newNote = await res.json();
    setNotes([...notes, newNote]);
    setTitle("");
    setContent("");
  };

  // DELETE a note
  const deleteNote = async (id: number) => {
    const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setNotes(notes.filter((note) => note.id !== id));
    } else {
      alert("Failed to delete note");
    }
  };

  // Start edit
  const startEdit = (note: any) => {
    setEditId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
    setEditContent("");
  };

  // Save edit
  const saveEdit = async () => {
    if (editId === null) return;

    const res = await fetch(`http://localhost:5000/api/notes/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, content: editContent }),
    });

    if (!res.ok) return alert("Failed to update note");

    const updated = await res.json();
    setNotes(notes.map((note) => (note.id === editId ? updated : note)));
    cancelEdit();
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Notes App</h1>

      {/* Add Note Form */}
      <div className="flex flex-col gap-2 mb-4">
        <input
          className="border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          className="border p-2 rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addNote}
        >
          Add Note
        </button>
      </div>

      {/* Notes List */}
      <ul>
        {notes.map((note) => (
          <li
            key={note.id}
            className="border p-3 mb-3 rounded flex flex-col gap-2"
          >
            {editId === note.id ? (
              <>
                <input
                  className="border p-1 rounded"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Edit Title"
                />
                <textarea
                  className="border p-1 rounded"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Edit Content"
                />
                <div className="flex gap-2">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={saveEdit}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-400 text-white px-2 py-1 rounded"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-bold">{note.title}</h3>
                <p>{note.content}</p>
                <div className="flex gap-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => startEdit(note)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => deleteNote(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
