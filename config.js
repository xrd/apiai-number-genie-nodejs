
config = {};
config.DEBUG = true;
config.MIN = 0;
config.MAX = 100;
config.MAX_DISTANCE = 75;
config.STEAM_SOUND_GAP = 5;
config.GAME_CONTEXT = 'game';
config.GENERATE_ANSWER_ACTION = 'generate_answer';
config.CHECK_GUESS_ACTION = 'check_guess';
config.QUIT_ACTION = 'quit';
config.PLAY_AGAIN_YES_ACTION = 'play_again_yes';
config.PLAY_AGAIN_NO_ACTION = 'play_again_no';
config.DEFAULT_FALLBACK_ACTION = 'input.unknown';
config.UNKNOWN_DEEPLINK_ACTION = 'deeplink.unknown';
config.YES_NO_CONTEXT = 'yes_no';
config.DONE_YES_NO_CONTEXT = 'done_yes_no';
config.DONE_YES_ACTION = 'done_yes';
config.DONE_NO_ACTION = 'done_no';
config.GUESS_ARGUMENT = 'guess';
config.RAW_TEXT_ARGUMENT = 'raw_text';
config.REPEAT_ACTION = 'repeat';

config.HIGHER_HINT = 'higher';
config.LOWER_HINT = 'lower';
config.NO_HINT = 'none';

config.SSML_SPEAK_START = '<speak>';
config.SSML_SPEAK_END = '</speak>';
config.COLD_WIND_AUDIO = '<audio src="https://xxxxxx/numbergeniesounds/NumberGenieEarcon_ColdWind.wav">cold wind sound</audio>';
config.STEAM_ONLY_AUDIO = '<audio src="https://xxxxxx/numbergeniesounds/NumberGenieEarcon_SteamOnly.wav">steam sound</audio>';
config.STEAM_AUDIO = '<audio src="https://xxxxxx/numbergeniesounds/NumberGenieEarcons_Steam.wav">steam sound</audio>';
config.YOU_WIN_AUDIO = '<audio src="https://xxxxxx/numbergeniesounds/NumberGenieEarcons_YouWin.wav">winning sound</audio>';

config.ANOTHER_GUESS_PROMPTS = ['What\'s your next guess?', 'Have another guess?', 'Try another.'];
config.LOW_PROMPTS = ['It\'s lower than %s.'];
config.HIGH_PROMPTS = ['It\'s higher than %s.'];
config.LOW_CLOSE_PROMPTS = ['Close, but not quite!'];
config.HIGH_CLOSE_PROMPTS = ['Close, but not quite!'];
config.LOWER_PROMPTS = ['You\'re getting warm.  It\'s lower than %s. Have another guess?',
  'Warmer. Take another guess that\'s lower than %s.', 'Close, but it\'s lower than %s.'];
config.HIGHER_PROMPTS = ['You\'re getting warm. It\'s higher than %s. Have another guess?',
  'Warmer. It\'s also higher than %s. Take another guess.', 'Close, but it\'s higher than %s.'];
config.LOWEST_PROMPTS = ['You\'re piping hot! But it\'s still lower.',
  'You\'re hot as lava! Go lower.', 'Almost there! A bit lower.'];
config.HIGHEST_PROMPTS = ['You\'re piping hot! But it\'s still higher.',
  'You\'re hot as lava! Go higher.', 'Almost there! A bit higher.'];

config.CORRECT_GUESS_PROMPTS = ['Well done! It is indeed %s.', 'Congratulations, that\'s it! I was thinking of %s.',
  'You got it! It\'s %s.' ];
config.PLAY_AGAIN_QUESTION_PROMPTS = ['Wanna play again?', 'Want to try again?', 'Hey, should we do that again?'];

config.QUIT_REVEAL_PROMPTS = ['Ok, I was thinking of %s.', 'Sure, I\'ll tell you the number anyway. It was %s.'];
config.QUIT_REVEAL_BYE = ['See you later.', 'Talk to you later.'];
config.QUIT_PROMPTS = ['Alright, talk to you later then.', 'OK, till next time.',
  'See you later.', 'OK, I\'m already thinking of a number for next time.'];

config.GREETING_PROMPTS = ['Let\'s play Number Genie!', 'Welcome to Number Genie!', 'Hi! This is Number Genie.',
  'Welcome back to Number Genie.'];
config.INVOCATION_PROMPT = ['I\'m thinking of a number from %s to %s. What\'s your first guess?'];
config.RE_PROMPT = ['Great!', 'Awesome!', 'Cool!', 'Okay, let\'s play again.', 'Okay, here we go again.',
  'Alright, one more time with feeling.'];
config.RE_INVOCATION_PROMPT = ['I\'m thinking of a new number from %s to %s. What\'s your guess?'];

config.WRONG_DIRECTION_LOWER_PROMPTS = ['Clever, but no. It\'s still lower than %s.',
  'Nice try, but it\'s still lower than %s.'];
config.WRONG_DIRECTION_HIGHER_PROMPTS = ['Clever, but no. It\'s still higher than %s.',
  'Nice try, but it\'s still higher than %s.'];

config.REALLY_COLD_LOW_PROMPTS = ['You\'re ice cold. It\'s way lower than %s.',
  'You\'re freezing cold. It\'s a lot lower than %s.'];
config.REALLY_COLD_HIGH_PROMPTS = ['You\'re ice cold. It’s way higher than %s.',
  'You\'re freezing cold. It\'s a lot higher than %s.'];
config.REALLY_HOT_LOW_PROMPTS_1 = ['Almost there.', 'Very close.'];
config.REALLY_HOT_LOW_PROMPTS_2 = ['Keep going.', 'So close, you\'re almost there.'];
config.REALLY_HOT_HIGH_PROMPTS_1 = ['Almost there.', 'So close.'];
config.REALLY_HOT_HIGH_PROMPTS_2 = ['Keep going.', 'Very close, you\'re almost there.'];

config.SAME_GUESS_PROMPTS_1 = ['It\'s still not %s. Guess %s.'];
config.SAME_GUESS_PROMPTS_2 = ['Maybe it\'ll be %s the next time. Let’s play again soon.'];
config.SAME_GUESS_PROMPTS_3 = ['It\'s still not %s. Guess again.'];

config.MIN_PROMPTS = ['I see what you did there. But no, it\'s higher than %s.'];
config.MAX_PROMPTS = ['Oh, good strategy. Start at the top. But no, it’s lower than %s.'];

config.MANY_TRIES_PROMPTS = ['Yes! It\'s %s. Nice job!  How about one more round?'];

config.FALLBACK_PROMPT_1 = ['Are you done playing Number Genie?'];
config.FALLBACK_PROMPT_2 = ['Since I\'m still having trouble, I\'ll stop here. Let’s play again soon.'];

config.DEEPLINK_PROMPT_1 = ['%s has %s letters. The number I\'m thinking of is higher. Have another guess?',
  '%s is a great guess. It has %s letters, but I\'m thinking of a higher number. What\'s your next guess?'];
config.DEEPLINK_PROMPT_2 = ['%s has %s letters. The number I\'m thinking of is lower. Have another guess?',
  '%s is a great first guess. It has %s letters, but the number I\'m thinking of is lower. Guess again!'];
config.DEEPLINK_PROMPT_3 = ['Wow! You\'re a true Number Genie! %s has %s letters and the number I was thinking of was %s! Well done!',
  'Amazing! You\'re a real Number Genie! %s has %s letters and the number I was thinking of was %s. Great job!'];

config.NO_INPUT_PROMPTS = ['I didn\'t hear a number', 'If you\'re still there, what\'s your guess?',
  'We can stop here. Let\'s play again soon.'];

config.REPEAT_PROMPTS = ['Sure. %s.', 'OK. %s.'];

exports.config = config;
