"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Home() {
  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const router = useRouter();

  // ✅ Get token safely (only on client)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ✅ Fetch all notes
  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchNotes = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/notes", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) {
          toast.error("Failed to fetch notes");
          return;
        }

        const data = await res.json();
        setNotes(data);
      } catch (err) {
        toast.error("Error fetching notes");
      }
    };

    fetchNotes();
  }, [token, router]);

  // ✅ Add Note
  const addNote = async () => {
    if (!title || !content) return toast.error("Both title and content required");

    try {
      const res = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) return toast.error("Failed to add note");

      const newNote = await res.json();
      setNotes([...notes, newNote]);
      setTitle("");
      setContent("");
      toast.success("Note added successfully!");
    } catch {
      toast.error("Error adding note");
    }
  };

  // ✅ Delete Note
  const deleteNote = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        setNotes(notes.filter((note) => note.id !== id));
        toast.success("Note deleted successfully!");
      } else {
        toast.error("Failed to delete note");
      }
    } catch {
      toast.error("Error deleting note");
    }
  };

  // ✅ Start Edit
  const startEdit = (note: any) => {
    setEditId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  // ✅ Cancel Edit
  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
    setEditContent("");
  };

  // ✅ Save Edit
  const saveEdit = async () => {
    if (editId === null) return;

    try {
      const res = await fetch(`http://localhost:5000/api/notes/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });

      if (!res.ok) return toast.error("Failed to update note");

      const updated = await res.json();
      setNotes(notes.map((note) => (note.id === editId ? updated : note)));
      cancelEdit();
      toast.success("Note updated successfully!");
    } catch {
      toast.error("Error updating note");
    }
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
