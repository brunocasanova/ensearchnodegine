function ensearchnodengine( options ){

    var default_options = {
        index_amount: 12,
        ignore_case: true
    };

    //this.config = merge( default_options, options );

}

module.exports = function ( args ){
	return new ensearchnodengine( args );
};