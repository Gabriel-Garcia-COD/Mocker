// models.js
const { DataTypes } = require('sequelize');
const db = require('../database/db');

const Response = db.define('Response', {
  body: {
    type: DataTypes.STRING,
  },
});

const Endpoint = db.define('Endpoint', {
  path: {
    type: DataTypes.STRING,
  },
  method: {
    type: DataTypes.STRING,
  },
});

const ClientAPI = db.define('ClientAPI', {
  clientID: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
});

ClientAPI.hasMany(Endpoint, { onDelete: 'CASCADE' });
Endpoint.belongsTo(ClientAPI);

Endpoint.hasOne(Response, { onDelete: 'CASCADE' });
Response.belongsTo(Endpoint);

module.exports = { ClientAPI, Endpoint, Response };
