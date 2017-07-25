const expect = require('chai').expect
require('mocha-sinon')

const wordfor = require('.')

describe('wordfor', () => {
    describe('createUrl()', () => {
        it('creates word with max parameter', () => {
            const url = wordfor.createRequestUrl(wordfor.url, 'word', { max: '5' })
            expect(url).to.equal('http://api.datamuse.com/words?max=5&ml=word&sp=')
        })
        it('creates word with starting letter parameter', () => {
            const url = wordfor.createRequestUrl(wordfor.url, 'word', { s: 'e' })
            expect(url).to.equal('http://api.datamuse.com/words?max=10&ml=word&sp=e%2A')

        })
    })
    describe('handleResults()', () => {
        describe('displays results', () => {
            beforeEach(function() {
                this.sinon.spy(console, 'log');
            });
            it('displays results', () => {
                wordfor.handleResults('[{"word":"word"},{"word":"test"},{"word":"result"}]', {})
                expect(console.log.called).to.be.true
                expect(console.log.firstCall.args[0]).to.equal('word')
            })
            it('displays sorted results', () => {
                wordfor.handleResults('[{"word":"word"},{"word":"test"},{"word":"result"}]', {a: '--alphabetize'})
                expect(console.log.firstCall.args[0]).to.equal('result')
                expect(console.log.lastCall.args[0]).to.equal('word')
            })
            it('displays sorted results', () => {
                wordfor.handleResults('[{"word":"word"},{"word":"test"},{"word":"result"}]', {a: '--alphabetize'})
                expect(console.log.firstCall.args[0]).to.equal('result')
                expect(console.log.lastCall.args[0]).to.equal('word')
            })
        })
    })
})
