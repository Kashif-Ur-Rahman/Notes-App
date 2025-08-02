"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md rounded-b-xl">
            <Link href="/" className="text-xl font-bold">
                Notes App
            </Link>
            <div className="flex gap-6">
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
