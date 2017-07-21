import { isObject, isString, isArray } from 'util'
import request from 'request'

request('http://api.datamuse.com/words?ml=test', (error, response, body) => {
    if (!error && response.statusCode == 200) {
        console.log(body)
    }
})
