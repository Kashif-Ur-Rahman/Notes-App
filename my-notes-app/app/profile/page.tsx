"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Profile() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useEffect(() => {
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchProfile = async () => {
            const res = await fetch("http://localhost:5000/api/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            } else {
                localStorage.removeItem("token");
                router.push("/login");
            }
        };

        fetchProfile();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    if (!user) return <p className="text-center mt-10">Loading profile...</p>;

    return (
        <div className="max-w-md mx-auto p-6 border rounded shadow">
            <h1 className="text-2xl font-bold mb-4">User Profile</h1>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>

            <button
                onClick={handleLogout}
                className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    );
}
