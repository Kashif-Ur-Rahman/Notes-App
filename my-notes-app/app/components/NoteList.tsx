"use client";
import { motion } from "framer-motion";
import { MdEdit, MdDelete } from "react-icons/md";
import { MdSave, MdCancel } from "react-icons/md";

interface Note {
    id: number;
    title: string;
    content: string;
    tags?: string;
}

interface NoteListProps {
    notes: Note[];
    editId: number | null;
    editTitle: string;
    editContent: string;
    editTags: string;
    setEditTitle: (value: string) => void;
    setEditContent: (value: string) => void;
    setEditTags: (value: string) => void;
    startEdit: (note: Note) => void;
    saveEdit: () => void;
    cancelEdit: () => void;
    deleteNote: (id: number) => void;
}

export default function NoteList({
    notes,
    editId,
    editTitle,
    editContent,
    editTags,
    setEditTitle,
    setEditContent,
    setEditTags,
    startEdit,
    saveEdit,
    cancelEdit,
    deleteNote,
}: NoteListProps) {
    return (
        <ul className="grid gap-6 mt-6">
            {notes.map((note, index) => (
                <motion.li
                    key={note.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white shadow-lg rounded-xl p-5 border hover:shadow-xl transition flex flex-col"
                >
                    {editId === note.id ? (
                        // ✅ Edit Mode
                        <>
                            <input
                                className="border p-2 rounded mb-2 w-full"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="Edit Title"
                            />
                            <textarea
                                className="border p-2 rounded mb-2 w-full"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                placeholder="Edit Content"
                            />
                            <input
                                className="border p-2 rounded mb-3 w-full"
                                value={editTags}
                                onChange={(e) => setEditTags(e.target.value)}
                                placeholder="Edit Tags (comma separated)"
                            />



                            <div className="flex gap-3 justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow"
                                    onClick={saveEdit}
                                >
                                    <MdSave size={18} />
                                    Save
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md shadow"
                                    onClick={cancelEdit}
                                >
                                    <MdCancel size={18} />
                                    Cancel
                                </motion.button>
                            </div>

                        </>
                    ) : (
                        // ✅ View Mode
                        <>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {note.title}
                            </h3>
                            <p className="text-gray-600 mb-4">{note.content}</p>

                            {note.tags && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {note.tags.split(",").map((tag, i) => (
                                        <span
                                            key={i}
                                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                                        >
                                            #{tag.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}



                            <div className="flex gap-3 justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md shadow"
                                    onClick={() => startEdit(note)}
                                >
                                    <MdEdit size={18} />
                                    Edit
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow"
                                    onClick={() => deleteNote(note.id)}
                                >
                                    <MdDelete size={18} />
                                    Delete
                                </motion.button>
                            </div>

                        </>
                    )}
                </motion.li>
            ))}
        </ul>
    );
}
