const express = require('express');
const router = express.Router();
const APIController = require('../controllers/APIController');

router.get('/getAllData', APIController.getAllData);

router.get('/consumeAPI/:clientID/*', APIController.consumeAPI);

router.get('/getAllEndpointsByClient/:clientID', APIController.getAllEndpointsByClient);

router.post('/addEndpoint', async (req, res) => {
    const { clientID, endpointPath, method, responseBody } = req.body;

    try {
        await APIController.addEndpoint(clientID, endpointPath, method, responseBody);
        res.status(200).json({ success: true, message: 'Endpoint added successfully!' });
    } catch (error) {
        console.error('Error adding endpoint:', error);

        const statusCode = error.statusCode || 500;
        res.status(statusCode).json(error.message);
    }
});

router.patch('/:clientID/*', async (req, res) => {
    const { clientID } = req.params;
    const endpointPath = `/${req.params[0]}`;
    const { method, responseBody } = req.body;

    try {
        await APIController.updateEndpoint(clientID, endpointPath, method, responseBody);
        res.send('Endpoint updated successfully!');
    } catch (error) {
        console.error('Error updating endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:clientID/*', async (req, res) => {
    const { clientID } = req.params;
    const endpointPath = `/${req.params[0]}`;

    try {
        await APIController.deleteEndpoint(clientID, endpointPath);
        res.send('Endpoint deleted successfully!');
    } catch (error) {
        console.error('Error deleting endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
