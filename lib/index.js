
var ensearchnodegine = require( './core' );
var query = require( './database/query' );

var options = {

	ignoreCase: true,
	ignoreSpecial: true,
};

var mysqlOptions = {

	table: 'Place',
	limit: 5,
	orderBy: 'score',
	order: 'DESC',

};

var modifiers = {

	plus: '+',
	minus: '-',
	major: '>',
	minor: '<',
	truncate: '*',
	neg: '~',

	exact: function ( str ){ return '"' + str + '"'; },

	subExp: function ( arg ){
		return '( ' + this.aggregate( arg, true ) + ' )';
	},
	
	aggregate: function ( arr, wra ){
		var search = '';
		var s = '';

		for( var i in arr ){
			s = arr[ i ].toString();
			search += s.replace( ',', '' );
			search += ' ';
		}

		search = search.trim();

		if( wra ) return search;

		return ' \'' + search.trim() + '\' ';

	},


};

var modes = {
	natural: 'IN NATURAL LANGUAGE MODE',
	naturalExpansion: 'IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION',
	boolean: 'IN BOOLEAN MODE',
	queryExpansion: 'WITH QUERY EXPANSION',
};

/* jshint ignore:start */
var regexp = /([\+\-\<\>])?(^[a-zA-Z]{1,25}|[a-zA-Z]{2,25}|\"[a-zA-Z]{2,25}(?:\ [a-zA-Z]{1,25})+")/g;
/* jshint ignore:end */

// '+cafe >guarda >sol' // IN BOOLEAN MODE ----> 19.22%

// '"( quinta de s jose )" >( *de *s )' IN BOOLEAN MODE ----> 9.947%

var searchString = modifiers.aggregate([

	// FIRST STAGE

	[	
		modifiers.exact(
			modifiers.subExp([
				 'quinta de s jose',
			])
		)
	],

	// SECOND STAGE

	[	
		modifiers.minor,
		modifiers.subExp([
			 [ modifiers.truncate,'de' ],
			 [ modifiers.truncate, 's' ],
		]),
	],

	// THIRD STAGE

	[	
		modifiers.major,
		modifiers.subExp([
			 [ modifiers.truncate,'quinta' ],
			 [ modifiers.truncate, 'jose' ],
		]),
	],

]);

//console.log( '\nFINAL:', searchString );

//process.exit();

var searchString = options.ignoreCase && searchString.toLowerCase() || searchString;
//var keyword = searchString.match( regexp );

//console.log( keyword );

//var special = '\'' + keyword.join( ' ' ) + '\'';

// searchString = '\' +( quinta de s jose ) >( quinta* jose* ) <( de s )\' ';

// searchString = '\' +( cafe guarda sol ) >( cafe* sol* ) <( guarda )\' ';

// searchString = '\' +( clube 3c ) +( clube* 3c* )\' ';

// QUERY
 // primeiro ver se encontra exacto..

//searchString = '\'clube 3c\' ';
//searchString = '\'cafe guarda sol\' ';
//searchString = '\'quinta de s jose\' ';

//searchString = '\'quinta de sao jose\' ';

// searchString = '\'"clube 3c" *clube *3c\' ';

// searchString = '\'"cafe guarda sol" *cafe *guarda *sol\' ';

//searchString = '\'"biblio" biblio*\' ';


 // se nao encontrar exacto tentar por palavras

console.log( '\n', searchString );

mysqlOptions.matchAgainst = [ 'MATCH( name ) AGAINST (' + searchString + ')' ];

// UNION to join tables

query([
	[ 'SELECT name,' ],

	mysqlOptions.matchAgainst,

	[ 'AS score' ],

	[ 'FROM' ],

	mysqlOptions.table,

	[ 'WHERE' ],

	mysqlOptions.matchAgainst,

	[ 'ORDER BY', [ mysqlOptions.orderBy, mysqlOptions.order ].join( ' ' ) ].join( ' ' ),

	[ 'LIMIT', mysqlOptions.limit ].join( ' ' ),
]);
