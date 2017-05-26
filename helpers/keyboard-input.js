const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}


/**
 * @param {String} msg
 * @param {RegExp} allowedMask              symbols allowed for input
 * @param {RegExp} readyMask                determine when the input is done
 * @returns {Promise}                       resolved with data entered
 */
function getKeyboardInput(msg, allowedMask = /^[0-9]$/, readyMask = /^[0-9]{4}$/) {
    return new Promise((resolve, reject) => {
        let input = '';

        function _stopKbdInput(shouldResolve = true, value = input) {
            process.stdout.write('\n');
            process.stdin.removeListener('keypress', _getKbdInput);
            if (shouldResolve) {
                resolve(value);
            } else {
                reject(value);
            }
        }

        function _getKbdInput(str, { ctrl, name }) {
            if (ctrl && name === 'c') {
                process.exit(1);
            }
            if (name === 'escape') {
                _stopKbdInput(false, NO_PIN);
            }

            if (allowedMask.test(name)) {
                input += name;
                process.stdout.write(name);
            }
            if (readyMask.test(input)) {
                _stopKbdInput();
            }
        }

        process.stdout.write(`${msg} `);
        process.stdin.on('keypress', _getKbdInput);
        process.stdin.on('end', () => _stopKbdInput());
    })
}


module.exports = { getKeyboardInput };
