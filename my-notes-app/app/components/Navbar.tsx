"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
    const router = useRouter();
    const [userName, setUserName] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

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
        <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
            {/* Logo + Title */}
            <div className="flex items-center gap-2">
                <Image
                    src="/notes-app-icon.jpeg"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                <Link href="/" className="text-xl font-bold">
                    Notes App
                </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
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

            {/* Mobile Hamburger */}
            <button
                className="md:hidden text-2xl"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? <FiX /> : <FiMenu />}
            </button>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="absolute top-16 left-0 w-full bg-blue-600 text-white flex flex-col items-center gap-4 py-4 md:hidden shadow-lg">
                    {userName && <span className="font-medium">Hi, {userName}</span>}
                    <Link
                        href="/"
                        className="hover:text-gray-200"
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        href="/profile"
                        className="hover:text-gray-200"
                        onClick={() => setMenuOpen(false)}
                    >
                        Profile
                    </Link>
                    <button
                        onClick={() => {
                            handleLogout();
                            setMenuOpen(false);
                        }}
                        className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
}
