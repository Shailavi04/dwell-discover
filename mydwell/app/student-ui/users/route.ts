export const users = [
    { id: 1, name: "Shailavi" },
    { id: 2, name: "Shivangi" },
];

// ✅ Fix: Use `new Response()`, not `Response.json()`
export async function GET() {
    return new Response(JSON.stringify(users), {
        headers: { "Content-Type": "application/json" },
        status: 200,
    });
}

export async function POST(request: Request) {
    try {
        const user = await request.json();

        // ✅ Fix: Validate that `name` is provided
        if (!user.name) {
            return new Response(JSON.stringify({ error: "Name is required" }), {
                headers: { "Content-Type": "application/json" },
                status: 400,
            });
        }

        const newUser = {
            id: users.length + 1,
            name: user.name,
        };

        users.push(newUser); // ⚠️ This data will reset on server restart.

        return new Response(JSON.stringify(newUser), {
            headers: { "Content-Type": "application/json" },
            status: 201,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            headers: { "Content-Type": "application/json" },
            status: 400,
        });
    }
}
