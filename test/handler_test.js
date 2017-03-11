var test = require('assert');

describe('Handler', function() {
    var h = require( '../handler.js' )
    // always return 3
    h.setRandomNumberGenerator( function() { return 3 } );
    
    it('should test the generateAnswer function', function() {
	let assistant = { data: {}, ask: function() { console.log( "Called ask" ); } }
	ans = h.generateAnswer( assistant )
	test.equal( assistant.data.answer, 3 );
    })

});
