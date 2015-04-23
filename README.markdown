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
