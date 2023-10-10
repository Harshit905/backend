const mongoose = require('mongoose');
const grid = require('gridfs-stream');

grid.mongo = mongoose.mongo;

const conn = mongoose.connection;

const gfs = grid(conn.db);
 
module.exports = gfs; // Export the GridFS object
