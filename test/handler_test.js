var test = require( 'assert' );
var sinon = require( 'sinon' );

describe( 'Handler', function() {
    var h = require( '../handler.js' )
    // always return 3
    h.setRandomNumberGenerator( function() { return 3 } );

    var assistant;
    var askSpy;
    var ask = function() {}
    
    beforeEach( function() {
	//askSpy = chai.spy(ask);
	assistant = { data: {}, ask: ask }
    });
    
    it('should test the generateAnswer function with default values', function() {
	ans = h.generateAnswer( assistant )
	test.equal( assistant.data.answer, 3 );
	test.equal( assistant.data.guessCount, 0 );
	test.equal( assistant.data.fallbackCount, 0 );
	test.equal( assistant.data.steamSoundCount, 0 );
	// test.equal( askSpy.should.have.been.called(), true )
	// expect(askSpy.Spy).should.have.been.called()
    })

    it( "should test the ask function", function() {
	assistant.data.printed = "hi there";
	h.ask( assistant, "some prompt" )
	test.equal( assistant.data.lastPrompt, assistant.data.printed );
	// console.log( "askSpy", askSpy )
	// expect(askSpy).should.have.been.called()
    });

    it( "should test spies", function() {

	function original () {
	    // do something cool
	    console.log( "Ummmm..." );
	}

	var spyIt = sinon.spy( original );
	// console.log( "Spy", require('util').inspect( spyIt ) );
	// console.log( "Func", function() { } );
	// original();
	spyIt();
	test.equal( spyIt.calledOnce, true );
	// expect(spyIt).should.have.been.called();
    });
    
});
