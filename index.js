#!/usr/bin/env node
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var meow = require('meow');
var request = require('request');
var queryString = require('query-string');

// Builds the request URL from word and parameters
var createRequestUrl = function createRequestUrl(url, word, _ref) {
    var _ref$max = _ref.max,
        max = _ref$max === undefined ? 20 : _ref$max,
        _ref$s = _ref.s,
        sp = _ref$s === undefined ? '' : _ref$s,
        rest = _objectWithoutProperties(_ref, ['max', 's']);

    return url + queryString.stringify(_extends({
        max: max,
        sp: sp + '*' }, rest, {
        ml: word
    }));
};

// Make request - displays help menu if no word is passed
var makeRequest = function makeRequest(url, word, parameters, handleResults) {
    word ? request(url, function (error, response, results) {
        return handleResults(results, parameters);
    }) : cli.showHelp();
};

// Custom function for applying argument functions to results
Array.prototype.applyArguments = function (args, argFunctions) {
    var _this = this;

    return Object.keys(args).filter(function (argument) {
        return argFunctions[argument] !== undefined;
    }).reduce(function (prev, argument) {
        return argFunctions[argument](_this);
    }, [].concat(_toConsumableArray(this)));
};

// Extract words, apply argumentFunctions, and log results
var handleResults = function handleResults(results, args) {

    // Functions corresponding to possible arguments intended to manipulate list after request
    var argFunctions = {
        a: function a(list) {
            return list.sort();
        },
        c: function c(list) {
            return list.map(function (word) {
                return word.toUpperCase(word);
            });
        }
    };

    if (results !== '[]') {
        JSON.parse(results).map(function (result) {
            return result.word;
        }).applyArguments(args, argFunctions).forEach(function (word) {
            return console.log(word);
        });
    } else {
        console.log('No results found.');
    }
};

// Configure CLI
var cli = meow('\n    Usage\n        $ wordfor <input>\n\n    Options\n        -m <num>, --max         Max number of results to return (Default: 10)\n        -s <char>, --start      Return words that start with specified letter\n        -a, --alphabetize       Alphabetize results\n        -c, --capitalize        Capitalize the results\n        -h, --help              Display helpful information\n', {
    alias: {
        m: '--max',
        s: '--start',
        a: '--alphabetize',
        c: '--capitalize',
        h: '--help'
    }
});

// Initializing the important stuff
var url = 'http://api.datamuse.com/words?';
var word = cli.input[0] ? cli.input[0] : '';
var args = cli.flags;
var requestUrl = createRequestUrl(url, word, args);

// Make request, passing the callback 'handleResults' function
makeRequest(requestUrl, word, args, handleResults);
