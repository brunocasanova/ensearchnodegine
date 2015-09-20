var database = require( './' );

// var index = 'ALTER TABLE Place ADD FULLTEXT INDEX `index_name_intro` ( name, intro )';
// var alter ='ALTER TABLE Place MODIFY name TEXT';

module.exports = function ( query ){
	query = query.join( ' ' ) + ';';

	database.connect();

	console.log( '\n','QUERY:', query, '\n' );

	database.query( query, response );

	database.end();
};

function response( err, rows, fields ){
	if( err ) throw err;

	if( Object.keys( rows ).length < 1 ) console.log( 'No results.' );

	for( var i in rows ){
		console.log( '[', +i + 1, ']', 'result: ', rows[i].name, ' - ', ( rows[i].score ).toString().substring( 0, 5 ) + '%' );
	}

}