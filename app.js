const { getKeyboardInput } = require('./helpers/keyboard-input');

const BAD_PIN = 'bad_pin';
const NO_PIN = 'no_pin';
const NOT_PURCHASED = 'not_purchased';

const Assets = {
    NORMAL: { name: '9 mile' },
    ADULT: { name: 'Brazzers vol. 19', isAdult: true },
    PAID: { name: 'Fast & Furious 8', price: 15 },
    ADULT_PAID: { name: 'Misfits', isAdult: true, price: 29.95 },
    FAILED: { name: 'Die hard', shouldFail: true }
};


function play(asset) {
    maybeAskForPin(asset)
        .then(() => maybePurchase(asset))
        .then(() => Player.play(asset))
        .catch(maybeShowErrorMsg)
        .then(() => process.exit());
}


function maybeAskForPin(asset) {
    return asset.isAdult
        ? getKeyboardInput('Enter PIN:')
            .then(pin => pin === '0000'
                ? true
                : Promise.reject(BAD_PIN)
            )
        : Promise.resolve();
}


function maybePurchase(asset) {
    return asset.price > 0
        ? getKeyboardInput(`Will you purchase "${asset.name}" for EUR${asset.price}?`, /^[yn]$/i, /^[yn]$/i)
            .then(answer => answer.toLowerCase() === 'y'
                ? true
                : Promise.reject(NOT_PURCHASED)
            )
        : Promise.resolve();
}


const Player = {
    play(asset) {
        if (asset.shouldFail) {
            return Promise.reject(`Player error ${~~(Math.random() * 5 + 1)}`);
        } else {
            console.log(`Playing the asset "${asset.name}"`);
            return true;
        }
    }
};


function maybeShowErrorMsg(e) {
    switch (e) {
        case BAD_PIN:
            console.error('ERROR: PIN incorrect');
            break;
        case NO_PIN:
            console.warn('WARN: PIN canceled');
            break;
        case NOT_PURCHASED:
            console.error('WARN: Purchase canceled');
            break;
        default:
            console.error('ERROR (unexpected):', e);
    }
}



// -------------------------- select the asset --------------------------
const assetTypes = Object.keys(Assets);
console.log('Assets available:');
assetTypes.forEach((type, i) => console.log(`${i}) ${type}`));

getKeyboardInput('Select asset:', /^[0-9]$/, /^[0-9]$/)
    .then((i) => {
        const type = assetTypes[i] || assetTypes[0];
        console.log(`\n${type} selected\n`);
        play(Assets[type]);
    })
    .catch(console.error);
