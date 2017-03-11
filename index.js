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

let config = require('./config').config;
let handler = require('./handler');

// HTTP Cloud Function handler
exports.number_genie = function (request, response) {
  console.log('headers: ' + JSON.stringify(request.headers));
  console.log('body: ' + JSON.stringify(request.body));

  const assistant = new ApiAiAssistant({request: request, response: response});
  let actionMap = new Map();
  actionMap.set(config.GENERATE_ANSWER_ACTION, handler.generateAnswer);
  actionMap.set(config.CHECK_GUESS_ACTION, handler.checkGuess);
  actionMap.set(config.QUIT_ACTION, handler.quit);
  actionMap.set(config.PLAY_AGAIN_YES_ACTION, handler.playAgainYes);
  actionMap.set(config.PLAY_AGAIN_NO_ACTION, handler.playAgainNo);
  actionMap.set(config.DEFAULT_FALLBACK_ACTION, handler.defaultFallback);
  actionMap.set(config.UNKNOWN_DEEPLINK_ACTION, handler.unhandledDeeplinks);
  actionMap.set(config.DONE_YES_ACTION, handler.doneYes);
  actionMap.set(config.DONE_NO_ACTION, handler.doneNo);
  actionMap.set(config.REPEAT_ACTION, handler.repeat);
  assistant.handleRequest(actionMap);
};
