"use client";

interface NoteFormProps {
    title: string;
    content: string;
    tags: string;
    setTitle: (value: string) => void;
    setContent: (value: string) => void;
    setTags: (value: string) => void;
    addNote: () => void;
}

export default function NoteForm({
    title,
    content,
    tags,
    setTitle,
    setContent,
    setTags,
    addNote,
}: NoteFormProps) {
    return (
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
            <input
                className="border p-2 rounded"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags (comma separated)"
            />
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={addNote}
            >
                Add Note
            </button>
        </div>
    );
}
