"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";

export default function Home() {
  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true);


  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchNotes = async () => {
      setLoading(true);
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
      } catch {
        toast.error("Error fetching notes");
      } finally {
        setLoading(false);
      }
    };


    fetchNotes();
  }, [token, router]);

  const addNote = async () => {
    if (!title || !content)
      return toast.error("Both title and content required");

    try {
      const res = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ title, content, tags }),
      });

      if (!res.ok) return toast.error("Failed to add note");

      const newNote = await res.json();
      setNotes([...notes, newNote]);
      setTitle("");
      setContent("");
      setTags("");
      toast.success("Note added successfully!");
    } catch {
      toast.error("Error adding note");
    }
  };

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

  const startEdit = (note: any) => {
    setEditId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTags(note.tags || "");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
    setEditContent("");
    setEditTags("");
  };

  const saveEdit = async () => {
    if (editId === null) return;

    try {
      const res = await fetch(`http://localhost:5000/api/notes/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          tags: editTags,
        }),
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

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase()) ||
      (note.tags && note.tags.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <SearchBar search={search} setSearch={setSearch} />
        <NoteForm
          title={title}
          content={content}
          tags={tags}
          setTitle={setTitle}
          setContent={setContent}
          setTags={setTags}
          addNote={addNote}
        />

        {loading ? (
          <div className="flex justify-center mt-10">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <p className="text-center text-gray-600 mt-6">No notes found</p>
        ) : (
          <NoteList
            notes={filteredNotes}
            editId={editId}
            editTitle={editTitle}
            editContent={editContent}
            editTags={editTags}
            setEditTitle={setEditTitle}
            setEditContent={setEditContent}
            setEditTags={setEditTags}
            startEdit={startEdit}
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
            deleteNote={deleteNote}
          />
        )}

        <NoteList
          notes={filteredNotes}
          editId={editId}
          editTitle={editTitle}
          editContent={editContent}
          editTags={editTags}
          setEditTitle={setEditTitle}
          setEditContent={setEditContent}
          setEditTags={setEditTags}
          startEdit={startEdit}
          saveEdit={saveEdit}
          cancelEdit={cancelEdit}
          deleteNote={deleteNote}
        />
      </div>
    </div>
  );
}
