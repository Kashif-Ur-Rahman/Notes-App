"use client";
import { CiSearch } from "react-icons/ci";

interface SearchBarProps {
    search: string;
    setSearch: (value: string) => void;
}

export default function SearchBar({ search, setSearch }: SearchBarProps) {
    return (
        <div className="relative w-full mb-4">
            <input
                type="text"
                placeholder="Search by title, content, or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 pl-10 rounded-3xl w-full"
            />
            <CiSearch className="absolute left-3 top-3 text-gray-500 text-xl" />
        </div>
    );
}
