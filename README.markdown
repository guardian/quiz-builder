# NOTE: This is no longer used - replaced by https://github.com/guardian/ten-four_quiz-builder

# Quiz builder

Tool for building Guardian quiz JSON.

## Static Dependencies

You will need NPM installed.

Then:

```bash
npm install
jspm install
```

## Development

Come up with a prefix for your DynamoDB tables (e.g. `QuizBuilderDev_`). Create `auth.sh` in this directory and add
the line

```
export DYNAMO_DB_TABLE_PREFIX=QuizBuilderDev_
```

Create a config table with that prefix (e.g. `QuizBuilderDev_Config`) and populate it with credentials for your Google
Auth set up:

```
.________________________________._______________________________________.
| key                            | value                                 |
|--------------------------------|---------------------------------------|
| googleauth.redirect_host       | http://localhost:9000/oauth2callback  |
| googleauth.client_id           | your client id here                   |
| googleauth.client_secret       | your secret here                      |
|________________________________|_______________________________________|
```

Create another table for the quizzes (e.g. `QuizBuilderDev_Quizzes`) - it should have a String hash key called 'id'.

Run the watch task in one terminal:

```bash
gulp watch-build
```

Run SBT in another:

```bash
./activator run
```

Then open http://localhost:9000 in your browser.

## Building

```bash
./activator dist
```
