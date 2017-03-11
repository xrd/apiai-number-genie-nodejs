let config = require( "./config" ).config
let sprintf = require('sprintf-js').sprintf;

exports.generateAnswer = function generateAnswer (assistant) {
    
    if (config.DEBUG) { console.log(arguments.callee.name); }
    let answer = getRandomNumber(config.MIN, config.MAX);
    assistant.data.answer = answer;
    assistant.data.guessCount = 0;
    assistant.data.fallbackCount = 0;
    assistant.data.steamSoundCount = 0;
    exports.ask(assistant, printf( assistant, getRandomPrompt(assistant, config.GREETING_PROMPTS) + ' ' +
			  getRandomPrompt(assistant, config.INVOCATION_PROMPT), config.MIN, config.MAX));
};

exports.checkGuess = function checkGuess (assistant) {
  if (config.DEBUG) { console.log(arguments.callee.name); }
  let answer = assistant.data.answer;
  let guess = parseInt(assistant.getArgument(config.GUESS_ARGUMENT));
  let diff = Math.abs(guess - answer);
  assistant.data.guessCount++;
  assistant.data.fallbackCount = 0;

    // Check for duplicate guesses
  if (assistant.data.previousGuess && guess === assistant.data.previousGuess) {
    assistant.data.duplicateCount++;
    if (assistant.data.duplicateCount === 1) {
      if (!assistant.data.hint || assistant.data.hint === config.NO_HINT) {
        exports.ask(assistant, printf( assistant, getRandomPrompt(assistant, config.SAME_GUESS_PROMPTS_3), guess));
      } else {
        exports.ask(assistant, printf( assistant, getRandomPrompt(assistant, config.SAME_GUESS_PROMPTS_1), guess, assistant.data.hint));
      }
      return;
    } else if (assistant.data.duplicateCount === 2) {
      assistant.tell(printf( assistant, getRandomPrompt(assistant, config.SAME_GUESS_PROMPTS_2), guess));
      return;
    }
  }
  assistant.data.duplicateCount = 0;
    // Check if user isn't following hints
  if (assistant.data.hint) {
    if (assistant.data.hint === config.HIGHER_HINT && guess <= assistant.data.previousGuess) {
      exports.ask(assistant, printf( assistant, getRandomPrompt(assistant, config.WRONG_DIRECTION_HIGHER_PROMPTS), assistant.data.previousGuess));
      return;
    } else if (assistant.data.hint === config.LOWER_HINT && guess >= assistant.data.previousGuess) {
      exports.ask(assistant, printf( assistant, getRandomPrompt(assistant, config.WRONG_DIRECTION_LOWER_PROMPTS), assistant.data.previousGuess));
      return;
    }
  }
    // Handle boundaries with special prompts
  if (answer !== guess) {
    if (guess === config.MIN) {
      assistant.data.hint = config.HIGHER_HINT;
      assistant.data.previousGuess = guess;
      exports.ask(assistant, printf( assistant, getRandomPrompt(assistant, config.MIN_PROMPTS), config.MIN));
      return;
    } else if (guess === config.MAX) {
      assistant.data.hint = config.LOWER_HINT;
      assistant.data.previousGuess = guess;
      exports.ask(assistant, printf( assistant, getRandomPrompt(assistant, config.MAX_PROMPTS), config.MAX));
      return;
    }
  }
    // Give different responses based on distance from number
  if (diff > config.MAX_DISTANCE) {
      // Guess is far away from number
    if (answer > guess) {
      assistant.data.hint = config.HIGHER_HINT;
      assistant.data.previousGuess = guess;
      exports.ask(assistant, config.SSML_SPEAK_START + config.COLD_WIND_AUDIO +
          printf( assistant, getRandomPrompt(assistant, config.REALLY_COLD_HIGH_PROMPTS), guess) + config.SSML_SPEAK_END);
      return;
    } else if (answer < guess) {
      assistant.data.hint = config.LOWER_HINT;
      assistant.data.previousGuess = guess;
      exports.ask(assistant, config.SSML_SPEAK_START + config.COLD_WIND_AUDIO +
          printf( assistant, getRandomPrompt(assistant, config.REALLY_COLD_LOW_PROMPTS), guess) + config.SSML_SPEAK_END);
      return;
    }
  } else if (diff === config.NUM_4) {
      // Guess is getting closer
    if (answer > guess) {
      assistant.data.hint = config.NO_HINT;
      assistant.data.previousGuess = guess;
      exports.ask(assistant, printf( assistant, getRandomPrompt(assistant, config.HIGH_CLOSE_PROMPTS)));
      return;
    } else if (answer < guess) {
      assistant.data.hint = config.NO_HINT;
      assistant.data.previousGuess = guess;
      exports.ask(assistant, printf( assistant, getRandomPrompt(assistant, config.LOW_CLOSE_PROMPTS)));
      return;
    }
  } else if (diff === config.NUM_3) {
      // Guess is even closer
    if (answer > guess) {
      assistant.data.hint = config.HIGHER_HINT;
      assistant.data.previousGuess = guess;
      if (assistant.data.steamSoundCount-- <= 0) {
        assistant.data.steamSoundCount = config.STEAM_SOUND_GAP;
        exports.ask(assistant, config.SSML_SPEAK_START + config.STEAM_ONLY_AUDIO + printf( assistant, getRandomPrompt(assistant, config.HIGHEST_PROMPTS)) +
            config.SSML_SPEAK_END);
      } else {
        exports.ask(assistant, getRandomPrompt(assistant, config.HIGHEST_PROMPTS));
      }
      return;
    } else if (answer < guess) {
      assistant.data.hint = config.LOWER_HINT;
      assistant.data.previousGuess = guess;
      if (assistant.data.steamSoundCount-- <= 0) {
        assistant.data.steamSoundCount = config.STEAM_SOUND_GAP;
        exports.ask(assistant, config.SSML_SPEAK_START + config.STEAM_ONLY_AUDIO + printf( assistant, getRandomPrompt(assistant, config.LOWEST_PROMPTS)) +
            config.SSML_SPEAK_END);
      } else {
        exports.ask(assistant, getRandomPrompt(assistant, config.LOWEST_PROMPTS));
      }
      return;
    }
  } else if (diff <= config.NUM_10 && diff > config.NUM_4) {
      // Guess is nearby number
    if (answer > guess) {
      assistant.data.hint = config.HIGHER_HINT;
      assistant.data.previousGuess = guess;
      exports.ask(assistant, printf( assistant, getRandomPrompt(assistant, config.HIGHER_PROMPTS), guess));
      return;
    } else if (answer < guess) {
      assistant.data.hint = config.LOWER_HINT;
      assistant.data.previousGuess = guess;
      exports.ask(assistant, printf( assistant, getRandomPrompt(assistant, config.LOWER_PROMPTS), guess));
      return;
    }
  }
    // Give hints on which direction to go
  if (answer > guess) {
    let previousHint = assistant.data.hint;
    assistant.data.hint = config.HIGHER_HINT;
    assistant.data.previousGuess = guess;
    if (previousHint && previousHint === config.HIGHER_HINT && diff <= 2) {
        // Very close to number
      if (assistant.data.steamSoundCount-- <= 0) {
        assistant.data.steamSoundCount = config.STEAM_SOUND_GAP;
        exports.ask(assistant, config.SSML_SPEAK_START + config.STEAM_AUDIO +
            printf( assistant, getRandomPrompt(assistant, config.REALLY_HOT_HIGH_PROMPTS_2)) + config.SSML_SPEAK_END);
      } else {
        if (diff <= 1) {
          exports.ask(assistant, getRandomPrompt(assistant, config.REALLY_HOT_HIGH_PROMPTS_1));
        } else {
          exports.ask(assistant, getRandomPrompt(assistant, config.REALLY_HOT_HIGH_PROMPTS_2));
        }
      }
    } else {
      exports.ask(assistant, printf( assistant, getRandomPrompt(assistant, config.HIGH_PROMPTS) + ' ' +
          getRandomPrompt(assistant, config.ANOTHER_GUESS_PROMPTS), guess));
    }
  } else if (answer < guess) {
    let previousHint = assistant.data.hint;
    assistant.data.hint = config.LOWER_HINT;
    assistant.data.previousGuess = guess;
    if (previousHint && previousHint === config.LOWER_HINT && diff <= 2) {
        // Very close to number
      if (assistant.data.steamSoundCount-- <= 0) {
        assistant.data.steamSoundCount = config.STEAM_SOUND_GAP;
        exports.ask(assistant, config.SSML_SPEAK_START + config.STEAM_AUDIO +
            printf( assistant, getRandomPrompt(assistant, config.REALLY_HOT_LOW_PROMPTS_2)) + config.SSML_SPEAK_END);
      } else {
        if (diff <= 1) {
          exports.ask(assistant, getRandomPrompt(assistant, config.REALLY_HOT_LOW_PROMPTS_1));
        } else {
          exports.ask(assistant, getRandomPrompt(assistant, config.REALLY_HOT_LOW_PROMPTS_2));
        }
      }
    } else {
      exports.ask(assistant, printf( assistant, getRandomPrompt(assistant, config.LOW_PROMPTS) + ' ' +
          getRandomPrompt(assistant, config.ANOTHER_GUESS_PROMPTS), guess));
    }
  } else {
      // Guess is same as number
    let guessCount = assistant.data.guessCount;
    assistant.data.hint = config.NO_HINT;
    assistant.data.previousGuess = -1;
    assistant.setContext(config.YES_NO_CONTEXT);
    assistant.data.guessCount = 0;
    if (guessCount >= 10) {
      exports.ask(assistant, config.SSML_SPEAK_START + config.YOU_WIN_AUDIO +
          printf( assistant, getRandomPrompt(assistant, config.MANY_TRIES_PROMPTS), answer) + config.SSML_SPEAK_END);
    } else {
      exports.ask(assistant, config.SSML_SPEAK_START + config.YOU_WIN_AUDIO +
          printf( assistant, getRandomPrompt(assistant, config.CORRECT_GUESS_PROMPTS) + ' ' +
          getRandomPrompt(assistant, config.PLAY_AGAIN_QUESTION_PROMPTS), answer) + config.SSML_SPEAK_END);
    }
  }
};

exports.quit = function quit (assistant) {
  if (config.DEBUG) { console.log(arguments.callee.name); }
  let answer = assistant.data.answer;
  assistant.tell(printf( assistant, getRandomPrompt(assistant, config.QUIT_REVEAL_PROMPTS) + ' ' +
      getRandomPrompt(assistant, config.QUIT_REVEAL_BYE), answer));
};

exports.playAgainYes = function playAgainYes (assistant) {
  if (config.DEBUG) { console.log(arguments.callee.name); }
  let answer = getRandomNumber(config.MIN, config.MAX);
  assistant.data.answer = answer;
  assistant.data.guessCount = 0;
  assistant.data.fallbackCount = 0;
  assistant.data.steamSoundCount = 0;
  exports.ask(assistant, printf( assistant, getRandomPrompt(assistant, config.RE_PROMPT) + ' ' +
      getRandomPrompt(assistant, config.RE_INVOCATION_PROMPT), config.MIN, config.MAX));
};

exports.playAgainNo = function playAgainNo (assistant) {
  if (config.DEBUG) { console.log(arguments.callee.name); }
  assistant.setContext(config.GAME_CONTEXT, 1);
  assistant.tell(printf( assistant, getRandomPrompt(assistant, config.QUIT_PROMPTS)));
};

exports.defaultFallback = function defaultFallback (assistant) {
  console.log('defaultFallback: ' + assistant.data.fallbackCount);
  if (assistant.data.fallbackCount === undefined) {
    assistant.data.fallbackCount = 0;
  }
  assistant.data.fallbackCount++;
    // Provide two prompts before ending game
  if (assistant.data.fallbackCount === 1) {
    assistant.setContext(config.DONE_YES_NO_CONTEXT);
    exports.ask(assistant, printf( assistant, getRandomPrompt(assistant, config.FALLBACK_PROMPT_1)));
  } else {
    assistant.tell(printf( assistant, getRandomPrompt(assistant, config.FALLBACK_PROMPT_2)));
  }
};

exports.unhandledDeeplinks = function unhandledDeeplinks (assistant) {
  if (config.DEBUG) { console.log(arguments.callee.name); }
  let answer = getRandomNumber(config.MIN, config.MAX);
  assistant.data.answer = answer;
  assistant.data.guessCount = 0;
  assistant.data.fallbackCount = 0;
  assistant.data.steamSoundCount = 0;
  assistant.setContext(config.GAME_CONTEXT, 1);
  let text = assistant.getArgument(config.RAW_TEXT_ARGUMENT);
  if (text) {
    if (isNaN(text)) {
        // Handle "talk to number genie about frogs" by counting
        // number of letters in the word as the guessed number
      let numberOfLetters = text.length;
      if (numberOfLetters < answer) {
        exports.ask(assistant, getRandomPrompt(assistant, config.GREETING_PROMPTS) + ' ' +
            printf( assistant, getRandomPrompt(assistant, config.DEEPLINK_PROMPT_1), text.toUpperCase(), numberOfLetters, numberOfLetters));
      } else if (numberOfLetters > answer) {
        exports.ask(assistant, getRandomPrompt(assistant, config.GREETING_PROMPTS) + ' ' +
            printf( assistant, getRandomPrompt(assistant, config.DEEPLINK_PROMPT_2), text.toUpperCase(), numberOfLetters, numberOfLetters));
      } else {
        assistant.data.hint = config.NO_HINT;
        assistant.data.previousGuess = -1;
        assistant.setContext(config.YES_NO_CONTEXT);
        exports.ask(assistant, config.SSML_SPEAK_START + config.YOU_WIN_AUDIO +
            printf( assistant, getRandomPrompt(assistant, config.DEEPLINK_PROMPT_3) + ' ' +
            getRandomPrompt(assistant, config.PLAY_AGAIN_QUESTION_PROMPTS), text.toUpperCase(), numberOfLetters, answer) + config.SSML_SPEAK_END);
      }
    } else {
        // Easter egg to set the answer for demos
        // Handle "talk to number genie about 55"
      assistant.data.answer = parseInt(text);
      assistant.ask(printf( assistant, getRandomPrompt(assistant, config.GREETING_PROMPTS) + ' ' +
          getRandomPrompt(assistant, config.INVOCATION_PROMPT), config.MIN, config.MAX));
    }
  } else {
    defaultFallback(assistant);
  }
};

exports.doneYes = function doneYes (assistant) {
  if (config.DEBUG) { console.log(arguments.callee.name); }
  assistant.setContext(config.GAME_CONTEXT, 1);
  assistant.tell(printf( assistant, getRandomPrompt(assistant, config.QUIT_PROMPTS)));
};

exports.doneNo = function doneNo (assistant) {
  if (config.DEBUG) { console.log(arguments.callee.name); }
  assistant.data.fallbackCount = 0;
  exports.ask(assistant, printf( assistant, getRandomPrompt(assistant, config.RE_PROMPT) + ' ' +
      getRandomPrompt(assistant, config.ANOTHER_GUESS_PROMPTS)));
};

exports.repeat = function repeat (assistant) {
  if (config.DEBUG) { console.log(arguments.callee.name); }
  let lastPrompt = assistant.data.lastPrompt;
  if (lastPrompt) {
    exports.ask(assistant, printf( assistant, getRandomPrompt(assistant, config.REPEAT_PROMPTS), lastPrompt), false);
  } else {
    exports.ask(assistant, printf( assistant, getRandomPrompt(assistant, config.ANOTHER_GUESS_PROMPTS)), false);
  }
};

exports.ask = function ask (assistant, prompt, persist) {
  console.log('ask: ' + prompt);
  if (persist === undefined || persist) {
    assistant.data.lastPrompt = assistant.data.printed;
  }
  assistant.ask(prompt, config.NO_INPUT_PROMPTS);
};

getRandomNumber = undefined
exports.setupNormalRandomNumberGenerator = function() {
    getRandomNumber = function() { return Math.floor(Math.random() * (max - min + 1)) + min; }
}

exports.setRandomNumberGenerator = function( func ) {
    getRandomNumber = func
}

function printf (assistant, prompt) {
    console.log('printf: ' + prompt);
    assistant.data.printed = prompt;
    // console.log( "What is passed: ", arguments[1] );
    return sprintf.apply(this, [ arguments[1] ] );
}

// Utility function to pick prompts
function getRandomPrompt (assistant, array) {
  let lastPrompt = assistant.data.lastPrompt;
  let prompt;
  if (lastPrompt) {
    for (let index in array) {
      prompt = array[index];
      if (prompt != lastPrompt) {
        break;
      }
    }
  } else {
    prompt = array[Math.floor(Math.random() * (array.length))];
  }
  return prompt;
}

exports.setupNormalRandomNumberGenerator();
