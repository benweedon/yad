'use strict';

module.exports = function(config) {
    config.set({
        singleRun: true,
        browsers: ['Firefox', 'FirefoxDeveloper', 'FirefoxNightly'],
        frameworks: ['mocha'],
        reporters: ['mocha'],
        files: [
            'node_modules/chai/chai.js',
            'node_modules/sinon-chrome/bundle/sinon-chrome-webextensions.min.js',
            'test/unit/globals.js',
            'addon/*.js',
            'test/unit/*.test.js'
        ],
        plugins: [
            'karma-firefox-launcher',
            'karma-mocha',
            'karma-mocha-reporter'
        ]
    });
};
