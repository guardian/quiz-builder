# Quiz builder

Tool for building Guardian quiz JSON.

## Dependencies

You will need NPM installed.

Then:

```bash
npm install
jspm install
```

## Development

Run the watch task for the SCSS in one terminal:

```bash
gulp
```

Run a web server in another:

```bash
python -m SimpleHTTPServer
```

Then open http://localhost:8000 in your browser.

## Building

```bash
gulp build
```

The output is in the `target` folder.

## Deploying

Add aws.json to this folder, with the following:

```json
{
    "key": "your aws key",
    "secret": "your aws secret",
    "region": "eu-west-1",
    "bucket": "aws-frontend-quiz-builder"
}
```

Now typing

``bash
gulp deploy
```

will build the app and upload it to S3.

## See it in action!

http://aws-frontend-quiz-builder.s3-website-eu-west-1.amazonaws.com/
