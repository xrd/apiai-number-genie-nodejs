var test = require('assert');

describe('Handler', function() {
    var h = require( '../handler.js' )
    it('should test the generateAnswer function', function() {
	let assistant = {}
	test.deepEqual( {}, h.generateAnswer( assistant ) )
    })

});
