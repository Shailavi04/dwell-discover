"use client";

import { useEffect } from "react";

export default function Error({ error }: { error: string }) {
    useEffect(() => {
        console.log("Error:", error);
    }, [error]);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-red-500 font-bold text-lg">
                Error fetching users data: {error}
            </div>
        </div>
    );
}
