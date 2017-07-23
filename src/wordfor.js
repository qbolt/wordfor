#!/usr/bin/env node
const meow = require('meow')
const request = require('request')
const queryString = require('query-string')

// Builds the request URL from word and parameters
const createRequestUrl = (url, word, { max = 10, s: sp = '' }) => url + queryString.stringify({
    max,
    ml: word,
    sp: sp ? sp + '*' : ''
})

// Make request - displays help menu if no word is passed
const makeRequest = (url, word, args, handleResults) => {
    word
        ? request(url, (error, response, results) => handleResults(results, args))
        : cli.showHelp()
}

// Custom function for applying argument functions to results
Array.prototype.applyArguments = function(args, argFunctions) {
    return Object
        .keys(args)
        .filter(argument => argFunctions[argument] !== undefined)
        .reduce((prev, argument) => argFunctions[argument](this), [...this])
}

// Extract words, apply argumentFunctions, and log results
const handleResults = (results, args) => {

    // Functions corresponding to possible arguments intended to manipulate list after request
    const argFunctions = {
        a: list => list.sort(),
        c: list => list.map(word => word.toUpperCase(word))
    }
    if (results !== '[]') {
        JSON.parse(results)
            .map(result => result.word)
            .applyArguments(args, argFunctions)
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

// Initializing the important stuff
const url = 'http://api.datamuse.com/words?'


const word = cli.input[0] ? cli.input[0] : ''
const args = cli.flags
const requestUrl = createRequestUrl(url, word, args)

// Make request, passing the callback 'handleResults' function
makeRequest(requestUrl, word, args, handleResults)

module.exports.url = url
module.exports.createRequestUrl = createRequestUrl
module.exports.handleResults = handleResults