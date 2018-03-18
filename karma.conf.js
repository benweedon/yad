'use strict';

module.exports = function(config) {
    config.set({
        singleRun: true,
        browsers: ['Firefox', 'FirefoxDeveloper', 'FirefoxNightly'],
        frameworks: ['mocha'],
        reporters: ['mocha'],
        files: [
            'addon/*.js',
            'node_modules/chai/chai.js',
            'test/unit/*.test.js'
        ],
        plugins: [
            'karma-firefox-launcher',
            'karma-mocha',
            'karma-mocha-reporter'
        ]
    });
};
