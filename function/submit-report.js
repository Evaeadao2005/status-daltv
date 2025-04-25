const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Método não permitido" })
        };
    }

    try {
        const data = JSON.parse(event.body);
        const client = new faunadb.Client({ 
            secret: process.env.FAUNADB_SECRET 
        });

        // Dados padrão para todos os reportes
        const baseData = {
            description: data.description,
            whatsapp: data.whatsapp || null,
            status: "pendente",
            created_at: new Date().toISOString()
        };

        // Dados específicos para solicitação de conteúdo
        const contentRequestData = {
            ...baseData,
            type: "solicitacao",
            content_type: data.content_type,
            content_name: data.content_name,
            reason: data.reason
        };

        // Dados específicos para reporte de problema
        const problemReportData = {
            ...baseData,
            type: "problema",
            problem_type: data.problem_type
        };

        const reportData = data.report_type === "request" ? contentRequestData : problemReportData;

        const result = await client.query(
            q.Create(q.Collection('reports'), { data: reportData })
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                success: true,
                message: data.report_type === "request" 
                    ? "Solicitação enviada com sucesso!" 
                    : "Problema reportado com sucesso!",
                id: result.ref.id
            })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                success: false,
                error: "Erro no servidor",
                details: error.message
            })
        };
    }
};
