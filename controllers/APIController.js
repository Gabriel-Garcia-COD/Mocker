// controllers.js
const { ClientAPI, Endpoint, Response } = require('../models/ClientAPI');

async function getAllData(req, res) {
    try {
        const allData = await ClientAPI.findAll({
            include: [{ model: Endpoint, include: [Response] }],
            order: [['clientID', 'ASC'], [{ model: Endpoint }, 'path', 'ASC']],
        });

        res.json({ data: allData });
    } catch (error) {
        console.error('Error fetching all data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getAllEndpointsByClient(req, res) {
    const { clientID } = req.params;
    console.log('clientID', clientID);

    try {
        const clientAPI = await ClientAPI.findOne({
            where: { clientID },
            include: [{ model: Endpoint, include: [Response] }],
        });

        if (!clientAPI) {
            console.log('Client API configuration not found');
            return res.status(404).json({ error: 'Client API configuration not found' });
        }

        console.log('Client API found:', clientAPI);

        const endpoints = clientAPI.Endpoints.map(endpoint => ({
            id: endpoint.id,
            path: endpoint.path,
            method: endpoint.method,
            response: endpoint.Response ? JSON.parse(endpoint.Response.body) : null,
        }));

        res.json({ endpoints });
    } catch (error) {
        console.error('Error fetching client API endpoints:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function consumeAPI(req, res) {
    const { clientID } = req.params;
    const endpointPath = `/${req.params[0]}`;

    try {
        const clientAPI = await ClientAPI.findOne({
            where: { clientID },
            include: [{ model: Endpoint, include: [Response] }],
        });

        if (!clientAPI) {
            return res.status(404).json({ error: 'Client API configuration not found' });
        }

        const endpoint = clientAPI.Endpoints.find(ep => ep.path === endpointPath || ep.path === endpointPath.slice(1));

        if (!endpoint) {
            return res.status(404).json({ error: 'Endpoint not found for the client' });
        }

        const responseBody = endpoint.Response ? JSON.parse(endpoint.Response.body) : {};

        res.json(responseBody);

    } catch (error) {
        console.error('Error fetching client API:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function addEndpoint(clientID, endpointPath, method, responseBody) {
    try {
        let clientAPI = await ClientAPI.findOne({
            where: { clientID },
            include: [{ model: Endpoint }],
        });

        if (!clientAPI) {
            clientAPI = await ClientAPI.create({ clientID });
            console.log('New client created successfully!');
        }

	const existingEndpoint = clientAPI && clientAPI.endpoints ? clientAPI.endpoints.find(ep => ep.path === endpointPath) : undefined;


        if (existingEndpoint) {
            const error = new Error('Endpoint with the same path already exists for this client');
            error.statusCode = 400;
            throw error;
        }

        const newEndpoint = await Endpoint.create({
            path: endpointPath,
            method,
            ClientAPIClientID: clientAPI.clientID,
            Response: {
                body: JSON.stringify(responseBody),
            },
        }, {
            include: [Response],
        });

        await clientAPI.addEndpoint(newEndpoint);

        console.log('Endpoint added successfully!');
    } catch (error) {
        console.error('Error adding endpoint:', error);
        throw error;
    }
}

async function updateEndpoint(clientID, endpointPath, method, responseBody) {
    try {
        const clientAPI = await ClientAPI.findOne({
            where: { clientID },
            include: [{ model: Endpoint, include: [Response] }],
        });

        if (!clientAPI) {
            throw new Error('Client API configuration not found');
        }

        const normalizedEndpointPath = endpointPath.startsWith('/') ? endpointPath.slice(1) : endpointPath;

        const endpoint = clientAPI.Endpoints.find((ep) => ep.path === normalizedEndpointPath);

        if (!endpoint) {
            throw new Error('Endpoint not found for the client');
        }

        console.log('Current responseBody:', endpoint.Response.body);

        endpoint.method = method;
        endpoint.Response.body = JSON.stringify(responseBody);

        await endpoint.Response.save();

        await endpoint.save();

        console.log('Updated responseBody:', endpoint.Response.body);

        console.log('Endpoint updated successfully!');
    } catch (error) {
        console.error('Error updating endpoint:', error);
        throw error;
    }
}

async function deleteEndpoint(clientID, endpointPath) {
    try {
        console.log('ClientID:', clientID);
        console.log('EndpointPath:', endpointPath);

        const clientAPI = await ClientAPI.findOne({
            where: { clientID },
            include: [{ model: Endpoint }],
        });

        if (!clientAPI) {
            throw new Error('Configuração da API do cliente não encontrada');
        }

        const normalizedEndpointPath = endpointPath.startsWith('/') ? endpointPath.slice(1) : endpointPath;

        const endpoint = clientAPI.Endpoints.find((ep) => ep.path === normalizedEndpointPath);

        if (endpoint) {
            await Endpoint.destroy({ where: { id: endpoint.id } });
            console.log('Endpoint excluído com sucesso!');
            console.log('clientAPI atualizado:', clientAPI.toJSON());
        } else {
            console.log('Endpoint not found for deletion');
        }
    } catch (error) {
        console.error('Erro ao excluir o endpoint:', error);
        throw error;
    }
}

module.exports = {
    getAllData,
    getAllEndpointsByClient,
    consumeAPI,
    addEndpoint,
    updateEndpoint,
    deleteEndpoint,
};
