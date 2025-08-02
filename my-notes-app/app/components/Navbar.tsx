"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
    const router = useRouter();
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const fetchProfile = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setUserName(data.name);
                }
            } catch {
                console.log("Error fetching profile");
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md rounded-b-xl">
            <Link href="/" className="text-xl font-bold">
                Notes App
            </Link>
            <div className="flex items-center gap-6">
                {userName && <span className="font-medium">Hi, {userName}</span>}
                <Link href="/" className="hover:text-gray-200">
                    Home
                </Link>
                <Link href="/profile" className="hover:text-gray-200">
                    Profile
                </Link>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
