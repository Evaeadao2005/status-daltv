const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Verifica autenticação
    const authHeader = event.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== "daltv-auth-token") {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: "Não autorizado" }),
        };
    }

    try {
        const { id, status } = JSON.parse(event.body);
        const client = new faunadb.Client({ 
            secret: process.env.FAUNADB_SECRET 
        });

        await client.query(
            q.Update(q.Ref(q.Collection('reports'), id), {
                data: { status }
            })
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Status atualizado" }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
