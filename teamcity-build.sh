npm install
export PATH="$(pwd)/node_modules/.bin:$PATH";
jspm install
gulp build
gulp build-quiz
./activator clean riffRaffArtifact
