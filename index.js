// Copyright 2016, Google, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// [START app]
'use strict';

process.env.DEBUG = 'actions-on-google:*';
let ApiAiAssistant = require('actions-on-google').ApiAiAssistant;
let sprintf = require('sprintf-js').sprintf;

let config = require( "./config" ).config

// HTTP Cloud Function handler
exports.number_genie = function (request, response) {
    console.log('headers: ' + JSON.stringify(request.headers));
    console.log('body: ' + JSON.stringify(request.body));
    
    const assistant = new ApiAiAssistant({request: request, response: response});
    let actionMap = new Map();
    actionMap.set(config.GENERATE_ANSWER_ACTION, generateAnswer);
    actionMap.set(config.CHECK_GUESS_ACTION, checkGuess);
    actionMap.set(config.QUIT_ACTION, quit);
    actionMap.set(config.PLAY_AGAIN_YES_ACTION, playAgainYes);
    actionMap.set(config.PLAY_AGAIN_NO_ACTION, playAgainNo);
    actionMap.set(config.DEFAULT_FALLBACK_ACTION, defaultFallback);
    actionMap.set(config.UNKNOWN_DEEPLINK_ACTION, unhandledDeeplinks);
    actionMap.set(config.DONE_YES_ACTION, doneYes);
    actionMap.set(config.DONE_NO_ACTION, doneNo);
    actionMap.set(config.REPEAT_ACTION, repeat);
    assistant.handleRequest(actionMap);
    
  function generateAnswer (assistant) {
    if( config.DEBUG ) { console.log( arguments.callee.name ); }
    let answer = getRandomNumber(config.MIN, config.MAX);
    assistant.data.answer = answer;
    assistant.data.guessCount = 0;
    assistant.data.fallbackCount = 0;
    assistant.data.steamSoundCount = 0;
    ask(assistant, printf(getRandomPrompt(assistant, config.GREETING_PROMPTS) + ' ' +
      getRandomPrompt(assistant, config.INVOCATION_PROMPT), config.MIN, config.MAX));
  }

  function checkGuess (assistant) {
    if( config.DEBUG ) { console.log( arguments.callee.name ); }
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
          ask(assistant, printf(getRandomPrompt(assistant, config.SAME_GUESS_PROMPTS_3), guess));
        } else {
          ask(assistant, printf(getRandomPrompt(assistant, config.SAME_GUESS_PROMPTS_1), guess, assistant.data.hint));
        }
        return;
      } else if (assistant.data.duplicateCount === 2) {
        assistant.tell(printf(getRandomPrompt(assistant, config.SAME_GUESS_PROMPTS_2), guess));
        return;
      }
    }
    assistant.data.duplicateCount = 0;
    // Check if user isn't following hints
    if (assistant.data.hint) {
      if (assistant.data.hint === config.HIGHER_HINT && guess <= assistant.data.previousGuess) {
        ask(assistant, printf(getRandomPrompt(assistant, config.WRONG_DIRECTION_HIGHER_PROMPTS), assistant.data.previousGuess));
        return;
      } else if (assistant.data.hint === config.LOWER_HINT && guess >= assistant.data.previousGuess) {
        ask(assistant, printf(getRandomPrompt(assistant, config.WRONG_DIRECTION_LOWER_PROMPTS), assistant.data.previousGuess));
        return;
      }
    }
    // Handle boundaries with special prompts
    if (answer !== guess) {
      if (guess === config.MIN) {
        assistant.data.hint = config.HIGHER_HINT;
        assistant.data.previousGuess = guess;
        ask(assistant, printf(getRandomPrompt(assistant, config.MIN_PROMPTS), config.MIN));
        return;
      } else if (guess === config.MAX) {
        assistant.data.hint = config.LOWER_HINT;
        assistant.data.previousGuess = guess;
        ask(assistant, printf(getRandomPrompt(assistant, config.MAX_PROMPTS), config.MAX));
        return;
      }
    }
    // Give different responses based on distance from number
    if (diff > config.MAX_DISTANCE ) {
      // Guess is far away from number
      if (answer > guess) {
        assistant.data.hint = config.HIGHER_HINT;
        assistant.data.previousGuess = guess;
        ask(assistant, config.SSML_SPEAK_START + config.COLD_WIND_AUDIO +
          printf(getRandomPrompt(assistant, config.REALLY_COLD_HIGH_PROMPTS), guess) + config.SSML_SPEAK_END);
        return;
      } else if (answer < guess) {
        assistant.data.hint = config.LOWER_HINT;
        assistant.data.previousGuess = guess;
        ask(assistant, config.SSML_SPEAK_START + config.COLD_WIND_AUDIO +
          printf(getRandomPrompt(assistant, config.REALLY_COLD_LOW_PROMPTS), guess) + config.SSML_SPEAK_END);
        return;
      }
    } else if (diff === config.NUM_4 ) {
      // Guess is getting closer
      if (answer > guess) {
        assistant.data.hint = config.NO_HINT;
        assistant.data.previousGuess = guess;
        ask(assistant, printf(getRandomPrompt(assistant, config.HIGH_CLOSE_PROMPTS)));
        return;
      } else if (answer < guess) {
        assistant.data.hint = config.NO_HINT;
        assistant.data.previousGuess = guess;
        ask(assistant, printf(getRandomPrompt(assistant, config.LOW_CLOSE_PROMPTS)));
        return;
      }
    } else if (diff === config.NUM_3 ) {
      // Guess is even closer
      if (answer > guess) {
        assistant.data.hint = config.HIGHER_HINT;
        assistant.data.previousGuess = guess;
        if (assistant.data.steamSoundCount-- <= 0) {
          assistant.data.steamSoundCount = config.STEAM_SOUND_GAP;
          ask(assistant, config.SSML_SPEAK_START + config.STEAM_ONLY_AUDIO + printf(getRandomPrompt(assistant, config.HIGHEST_PROMPTS)) +
            config.SSML_SPEAK_END);
        } else {
          ask(assistant, getRandomPrompt(assistant, config.HIGHEST_PROMPTS));
        }
        return;
      } else if (answer < guess) {
        assistant.data.hint = config.LOWER_HINT;
        assistant.data.previousGuess = guess;
        if (assistant.data.steamSoundCount-- <= 0) {
          assistant.data.steamSoundCount = config.STEAM_SOUND_GAP;
          ask(assistant, config.SSML_SPEAK_START + config.STEAM_ONLY_AUDIO + printf(getRandomPrompt(assistant, config.LOWEST_PROMPTS)) +
            config.SSML_SPEAK_END);
        } else {
          ask(assistant, getRandomPrompt(assistant, config.LOWEST_PROMPTS));
        }
        return;
      }
    } else if (diff <= config.NUM_10 && diff > config.NUM_4 ) {
      // Guess is nearby number
      if (answer > guess) {
        assistant.data.hint = config.HIGHER_HINT;
        assistant.data.previousGuess = guess;
        ask(assistant, printf(getRandomPrompt(assistant, config.HIGHER_PROMPTS), guess));
        return;
      } else if (answer < guess) {
        assistant.data.hint = config.LOWER_HINT;
        assistant.data.previousGuess = guess;
        ask(assistant, printf(getRandomPrompt(assistant, config.LOWER_PROMPTS), guess));
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
          ask(assistant, config.SSML_SPEAK_START + config.STEAM_AUDIO +
            printf(getRandomPrompt(assistant, config.REALLY_HOT_HIGH_PROMPTS_2)) + config.SSML_SPEAK_END);
        } else {
          if (diff <= 1) {
            ask(assistant, getRandomPrompt(assistant, config.REALLY_HOT_HIGH_PROMPTS_1));
          } else {
            ask(assistant, getRandomPrompt(assistant, config.REALLY_HOT_HIGH_PROMPTS_2));
          }
        }
      } else {
        ask(assistant, printf(getRandomPrompt(assistant, config.HIGH_PROMPTS) + ' ' +
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
          ask(assistant, config.SSML_SPEAK_START + config.STEAM_AUDIO +
            printf(getRandomPrompt(assistant, config.REALLY_HOT_LOW_PROMPTS_2)) + config.SSML_SPEAK_END);
        } else {
          if (diff <= 1) {
            ask(assistant, getRandomPrompt(assistant, config.REALLY_HOT_LOW_PROMPTS_1));
          } else {
            ask(assistant, getRandomPrompt(assistant, config.REALLY_HOT_LOW_PROMPTS_2));
          }
        }
      } else {
        ask(assistant, printf(getRandomPrompt(assistant, config.LOW_PROMPTS) + ' ' +
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
        ask(assistant, config.SSML_SPEAK_START + config.YOU_WIN_AUDIO +
          printf(getRandomPrompt(assistant, config.MANY_TRIES_PROMPTS), answer) + config.SSML_SPEAK_END);
      } else {
        ask(assistant, config.SSML_SPEAK_START + config.YOU_WIN_AUDIO +
          printf(getRandomPrompt(assistant, config.CORRECT_GUESS_PROMPTS) + ' ' +
          getRandomPrompt(assistant, config.PLAY_AGAIN_QUESTION_PROMPTS), answer) + config.SSML_SPEAK_END);
      }
    }
  }

  function quit (assistant) {
    if( config.DEBUG ) { console.log( arguments.callee.name ); }
    let answer = assistant.data.answer;
    assistant.tell(printf(getRandomPrompt(assistant, config.QUIT_REVEAL_PROMPTS) + ' ' +
      getRandomPrompt(assistant, config.QUIT_REVEAL_BYE), answer));
  }

    function playAgainYes (assistant) {
    if( config.DEBUG ) { console.log( arguments.callee.name ); }
    let answer = getRandomNumber(config.MIN, config.MAX);
    assistant.data.answer = answer;
    assistant.data.guessCount = 0;
    assistant.data.fallbackCount = 0;
    assistant.data.steamSoundCount = 0;
    ask(assistant, printf(getRandomPrompt(assistant, config.RE_PROMPT) + ' ' +
      getRandomPrompt(assistant, config.RE_INVOCATION_PROMPT), config.MIN, config.MAX));
  }

  function playAgainNo (assistant) {
    if( config.DEBUG ) { console.log( arguments.callee.name ); }
    assistant.setContext(config.GAME_CONTEXT, 1);
    assistant.tell(printf(getRandomPrompt(assistant, config.QUIT_PROMPTS)));
  }

  function defaultFallback (assistant) {
    console.log('defaultFallback: ' + assistant.data.fallbackCount);
    if (assistant.data.fallbackCount === undefined) {
      assistant.data.fallbackCount = 0;
    }
    assistant.data.fallbackCount++;
    // Provide two prompts before ending game
    if (assistant.data.fallbackCount === 1) {
      assistant.setContext(config.DONE_YES_NO_CONTEXT);
      ask(assistant, printf(getRandomPrompt(assistant, config.FALLBACK_PROMPT_1)));
    } else {
      assistant.tell(printf(getRandomPrompt(assistant, config.FALLBACK_PROMPT_2)));
    }
  }

  function unhandledDeeplinks (assistant) {
    if( config.DEBUG ) { console.log( arguments.callee.name ); }
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
          ask(assistant, getRandomPrompt(assistant, config.GREETING_PROMPTS) + ' ' +
            printf(getRandomPrompt(assistant, config.DEEPLINK_PROMPT_1), text.toUpperCase(), numberOfLetters, numberOfLetters));
        } else if (numberOfLetters > answer) {
          ask(assistant, getRandomPrompt(assistant, config.GREETING_PROMPTS) + ' ' +
            printf(getRandomPrompt(assistant, config.DEEPLINK_PROMPT_2), text.toUpperCase(), numberOfLetters, numberOfLetters));
        } else {
          assistant.data.hint = config.NO_HINT;
          assistant.data.previousGuess = -1;
          assistant.setContext(config.YES_NO_CONTEXT);
          ask(assistant, config.SSML_SPEAK_START + config.YOU_WIN_AUDIO +
            printf(getRandomPrompt(assistant, config.DEEPLINK_PROMPT_3) + ' ' +
            getRandomPrompt(assistant, config.PLAY_AGAIN_QUESTION_PROMPTS), text.toUpperCase(), numberOfLetters, answer) + config.SSML_SPEAK_END);
        }
      } else {
        // Easter egg to set the answer for demos
        // Handle "talk to number genie about 55"
        assistant.data.answer = parseInt(text);
        assistant.ask(printf(getRandomPrompt(assistant, config.GREETING_PROMPTS) + ' ' +
          getRandomPrompt(assistant, config.INVOCATION_PROMPT), config.MIN, config.MAX));
      }
    } else {
      defaultFallback(assistant);
    }
  }

  function doneYes (assistant) {
    if( config.DEBUG ) { console.log( arguments.callee.name ); }
    assistant.setContext(config.GAME_CONTEXT, 1);
    assistant.tell(printf(getRandomPrompt(assistant, config.QUIT_PROMPTS)));
  }

  function doneNo (assistant) {
    if( config.DEBUG ) { console.log( arguments.callee.name ); }
    assistant.data.fallbackCount = 0;
    ask(assistant, printf(getRandomPrompt(assistant, config.RE_PROMPT) + ' ' +
      getRandomPrompt(assistant, config.ANOTHER_GUESS_PROMPTS)));
  }

  function repeat (assistant) {
    if( config.DEBUG ) { console.log( arguments.callee.name ); }
    let lastPrompt = assistant.data.lastPrompt;
    if (lastPrompt) {
      ask(assistant, printf(getRandomPrompt(assistant, config.REPEAT_PROMPTS), lastPrompt), false);
    } else {
      ask(assistant, printf(getRandomPrompt(assistant, config.ANOTHER_GUESS_PROMPTS)), false);
    }
  }

  function ask (assistant, prompt, persist) {
    console.log('ask: ' + prompt);
    if (persist === undefined || persist) {
      assistant.data.lastPrompt = assistant.data.printed;
    }
    assistant.ask(prompt, config.NO_INPUT_PROMPTS);
  }

  function printf (prompt) {
    console.log('printf: ' + prompt);
    assistant.data.printed = prompt;
    return sprintf.apply(this, arguments);
  }


};

function getRandomNumber (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
