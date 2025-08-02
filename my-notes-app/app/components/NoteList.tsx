"use client";

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
        <ul>
            {notes.map((note) => (
                <li
                    key={note.id}
                    className="bg-gray-300 shadow-md rounded-xl p-4 mb-4 border hover:shadow-lg transition"
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
                            <input
                                className="border p-1 rounded"
                                value={editTags}
                                onChange={(e) => setEditTags(e.target.value)}
                                placeholder="Edit Tags"
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
                            {note.tags && (
                                <span className="text-sm text-gray-600">
                                    Tags: {note.tags}
                                </span>
                            )}
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
    );
}
