const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "daltv123";

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { username, password } = JSON.parse(event.body);
        
        if (username === ADMIN_USER && password === ADMIN_PASS) {
            return {
                statusCode: 200,
                body: JSON.stringify({ 
                    token: "daltv-auth-token", 
                    message: "Login successful" 
                }),
            };
        } else {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: "Credenciais inválidas" }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};
