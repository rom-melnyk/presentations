const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);

const AUDIO_DIR = path.join(__dirname, 'assets/audio');
const JSON_FILE = path.join(AUDIO_DIR, 'audio-files.json');
const AUDIO_FILE_MASK = /\.(mp3|ogg|oga|wav|wma)$/i;

readdir(AUDIO_DIR)
    .then((files) => {
        const audioFiles = files.filter(f => AUDIO_FILE_MASK.test(f));
        if (audioFiles.length < 1) {
            throw `[ error ] No audio files found in "${AUDIO_DIR}/"`;
        }
        return writeFile(JSON_FILE, JSON.stringify(audioFiles));
    })
    .then(() => {
        console.log('\n[ i ] Audio sources prepared successfully\n');
        process.exit(0);
    })
    .catch((err) => {
        console.error('\n', err, '\n');
        process.exit(1);
    });
