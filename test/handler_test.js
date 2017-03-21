var test = require( 'assert' );
var sinon = require( 'sinon' );

describe( 'Handler', function() {
    var h = require( '../handler.js' )
    // always return 3
    h.setRandomNumberGenerator( function() { return 3 } );

    var assistant, askSpy;
    
    beforeEach( function() {
	askSpy = sinon.spy();
	assistant = { data: {}, ask: askSpy }
    });
    
    it('should test the generateAnswer function with default values', function() {
	ans = h.generateAnswer( assistant, 0, 100 )
	test.equal( assistant.data.answer, 3 );
	test.equal( assistant.data.guessCount, 0 );
	test.equal( assistant.data.fallbackCount, 0 );
	test.equal( assistant.data.steamSoundCount, 0 );
    })

    it( "should test the ask function", function() {
	assistant.data.printed = "hi there";
	h.ask( assistant, "some prompt" )
	test.equal( assistant.data.lastPrompt, assistant.data.printed );
	test.equal( askSpy.calledOnce, true );
    });

    xit( "should test the repeat function with last prompt repetition", function() {
	assistant.data.lastPrompt = true;
	h.repeat( assistant );
	test.equal( askSpy.calledOnce, true );
	test.equal( askSpy.getCall(0).args[2], false )
    });

    describe( "getRandomPrompt", function() {
	it( "should return a random prompt from an array", function() {
	    var prompts = [ "one", "two", "three" ]

	    h.getRandomPrompt( assistant, prompts )
	});
    });

    describe( "printf", function() {
	it( "should test the printf function and have proper side effects", function() {
	    var rv = h.printf( assistant, "abc %s", "def" );
	    // console.log( "TEST PRINTF", assistant.data.printed, "abc def" );
	    test.equal( assistant.data.printed, "abc %s" )
	    // console.log( "TEST RV", rv, "abc def" );
	    test.equal( rv, "abc def" )
	});

	it( "should work with multiple arguments", function() {
	    prompt = "Welcome back to Number Genie. I'm thinking of a number from %s to %s. What's your first guess?"
	    var rv = h.printf( assistant, prompt, 10, 100 );
	    test.equal( rv,
			"Welcome back to Number Genie. I'm thinking of a number from 10 to 100. What's your first guess?" );
	})
    });
    
});
