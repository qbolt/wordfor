#!/usr/bin/env node
const meow = require('meow')
const request = require('request')
const queryString = require('query-string')

// Custom function for applying argument functions to results
Array.prototype.applyArguments = function(args, argumentFunctions) {
    return Object
        .keys(args)
        .filter(argument => argumentFunctions[argument] !== undefined)
        .reduce((prev, argument) => argumentFunctions[argument](this), [...this])
}

const url = 'http://api.datamuse.com/words?'

// Builds the request URL from word and parameters
const createRequestUrl = (word, { max = 20, s: sp = '', ...rest }) => url + queryString.stringify({ max, sp: sp + '*', ...rest, ml: word })

// Makes request and passes results to handleResults()
const makeRequest = (word, parameters) => request(createRequestUrl(word, parameters), (error, response, results) => handleResults(results, parameters))

// Init request - displays help menu if no word is passed
const initRequest = (word = '', parameters) => word === '' ? cli.showHelp() : makeRequest(word, parameters)

// Functions corresponding to possible arguments intended to manipulate list after request
const argumentFunctions = {
    a: list => list.sort(),
    c: list => list.map(word => word.toUpperCase(word))
}

// Extract words, apply argumentFunctions, and log results
const handleResults = (results, parameters) => {
    if (results !== '[]') {
        JSON.parse(results)
            .map(result => result.word)
            .applyArguments(parameters, argumentFunctions)
            .forEach(word => console.log(word))
    } else {
        console.log('No results found.')
    }
}

// Configure CLI
const cli = meow(`
    Usage
        $ wordfor <input>

    Options
        -m <num>, --max         Max number of results to return (Default: 10)
        -s <char>, --start      Return words that start with specified letter
        -a, --alphabetize       Alphabetize results
        -c, --capitalize        Capitalize the results
        -h, --help              Display helpful information
`, {
    alias: {
        m: '--max',
        s: '--start',
        a: '--alphabetize',
        c: '--capitalize',
        h: '--help'
    }
})

// Initialize request, passing input and flags
initRequest(cli.input[0], cli.flags)
