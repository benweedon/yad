module.exports = {
    'extends': 'eslint:recommended',
    'env': {
        'browser': true,
        'es6': true,
        'mocha': true,
        'node': true
    },
    'plugins': [
        'json',
        'mocha',
        'promise'
    ],
    'rules': {
        'no-cond-assign': 'off',
        'quotes': ['error', 'single']
    }
};
