function ensearchnodengine( options ){

   	defaultoOptions = {
        index_amount: 12,
        ignore_case: true
    };

}

module.exports = function ( args ){ return new ensearchnodengine( args ); };