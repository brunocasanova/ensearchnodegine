var mysql = require( 'mysql' );
var config = require( '../../config.json' );

module.exports = mysql.createConnection( config.database );

