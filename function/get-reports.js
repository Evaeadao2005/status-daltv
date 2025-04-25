const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event) => {
    if (event.httpMethod !== "GET") {
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
        const client = new faunadb.Client({ 
            secret: process.env.FAUNADB_SECRET 
        });

        const result = await client.query(
            q.Map(
                q.Paginate(q.Documents(q.Collection('reports'))),
                q.Lambda(x => q.Get(x))
            )
        );

        const reports = result.data.map(doc => {
            return {
                id: doc.ref.id,
                ...doc.data
            };
        });

        return {
            statusCode: 200,
            body: JSON.stringify(reports),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
