"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import SignupPage from "../signup/page";
import ParticlesBackground from "../components/ParticlesBackground";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                toast.error("Login failed");
                return;
            }

            const data = await res.json();
            localStorage.setItem("token", data.token);

            toast.success("Login successful!");
            router.push("/"); // Redirect to notes page
        } catch (error) {
            toast.error("Login error");
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center">
            <ParticlesBackground />
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="p-6 max-w-md mx-auto">
                    <h1 className="text-2xl font-bold mb-4">Login</h1>
                    <input
                        className="border p-2 mb-2 w-full rounded"
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="border p-2 mb-2 w-full rounded"
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                        onClick={handleLogin}
                    >
                        Login
                    </button>

                    <div className="mt-4">
                        <p>
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="text-blue-500 hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
