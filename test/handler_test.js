var test = require('assert');

describe( 'Handler', function() {
    var h = require( '../handler.js' )
    // always return 3
    h.setRandomNumberGenerator( function() { return 3 } );

    var assistant;
    
    beforeEach( function() {
	assistant = { data: {}, ask: function() { /* console.log( "Called ask" ); */ } }
	// spy on the ask function next... NYI.
    });
    
    it('should test the generateAnswer function', function() {
	ans = h.generateAnswer( assistant )
	test.equal( assistant.data.answer, 3 );
	test.equal( assistant.data.guessCount, 0 );
	test.equal( assistant.data.fallbackCount, 0 );
	test.equal( assistant.data.steamSoundCount, 0 );
    })

    it( "should test the ask function", function() {
	assistant.data.printed = "hi there";
	h.ask( assistant, "some prompt" )
	test.equal( assistant.data.lastPrompt, assistant.data.printed );
    });
    
});
