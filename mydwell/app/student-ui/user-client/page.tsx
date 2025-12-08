"use client";
import { useState, useEffect } from "react";

type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
};

export default function UserClient() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch(
                    "https://jsonplaceholder.typicode.com/users"
                );
                if (!response.ok) throw new Error("Failed to fetch users");

                const data = await response.json();
                setUsers(data);
            } catch (err: any) {
                setError(`Failed to fetch users: ${err.message}`);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    if (loading) return <p className="text-center text-gray-700">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Users List
            </h2>
            <ul className="space-y-4">
                {users.map((user) => (
                    <li
                        key={user.id}
                        className="bg-white p-4 shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-all"
                    >
                        <p className="text-lg font-semibold text-gray-900">
                            {user.name}
                        </p>
                        <p className="text-gray-600">{user.email}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
