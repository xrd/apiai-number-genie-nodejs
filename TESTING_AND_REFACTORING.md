# Writing tests for Actions on Google

## Goals

- [x] Run using `npm test` and actually run tests with mocha.
- [ ] Run the code outside of Actions (API.ai). Right now, running "node index.js" does not fail if the config variables are wrong, etc. None of the code actually is hit without being inside API.ai. Slow feedback loop.
- [ ] Define the behavior of each function: understand how the API.ai calls into the functions; writing a test to instrument it means we understand the interface.
- [ ] Mocking: Explore how mocking the data sent into the function will look.
- [ ] Remove magic numbers from code (store as consts which explain what they do).
- [x] make debugging easier: replace `console.log( "functionName" )` with `console.log( arguments.callee.name )` code to retrieve that automatically if debug variable is set.
- [ ] No globals (comes from modular and testable code)
- [ ] Make the code readable
  * start with simple to read index.js and then move other code to modular pieces
  * Configuration is immense, move this to its own module
  * Make functions < 10 lines long for readability.
