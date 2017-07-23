#!/usr/bin/env node
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var meow = require('meow');
var request = require('request');
var queryString = require('query-string');

// Custom function for applying argument functions to results
Array.prototype.applyArguments = function (args, argumentFunctions) {
    var _this = this;

    return Object.keys(args).filter(function (argument) {
        return argumentFunctions[argument] !== undefined;
    }).reduce(function (prev, argument) {
        return argumentFunctions[argument](_this);
    }, [].concat(_toConsumableArray(this)));
};

var url = 'http://api.datamuse.com/words?';

// Builds the request URL from word and parameters
var createRequestUrl = function createRequestUrl(word, _ref) {
    var _ref$max = _ref.max,
        max = _ref$max === undefined ? 20 : _ref$max,
        _ref$s = _ref.s,
        sp = _ref$s === undefined ? '' : _ref$s,
        rest = _objectWithoutProperties(_ref, ['max', 's']);

    return url + queryString.stringify(_extends({ max: max, sp: sp + '*' }, rest, { ml: word }));
};

// Makes request and passes results to handleResults()
var makeRequest = function makeRequest(word, parameters) {
    return request(createRequestUrl(word, parameters), function (error, response, results) {
        return handleResults(results, parameters);
    });
};

// Init request - displays help menu if no word is passed
var initRequest = function initRequest() {
    var word = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var parameters = arguments[1];
    return word === '' ? cli.showHelp() : makeRequest(word, parameters);
};

// Functions corresponding to possible arguments intended to manipulate list after request
var argumentFunctions = {
    a: function a(list) {
        return list.sort();
    },
    c: function c(list) {
        return list.map(function (word) {
            return word.toUpperCase(word);
        });
    }

    // Extract words, apply argumentFunctions, and log results
};var handleResults = function handleResults(results, parameters) {
    if (results !== '[]') {
        JSON.parse(results).map(function (result) {
            return result.word;
        }).applyArguments(parameters, argumentFunctions).forEach(function (word) {
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

// Initialize request, passing input and flags
initRequest(cli.input[0], cli.flags);
