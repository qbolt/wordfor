import { expect } from 'chai'

import { addOne } from '../src/wordfor'

describe('Change case', function() {
    describe('addOne()', function() {
        it('should add one', function() {
            expect(1).to.equal(addOne(0))
            expect(-1).to.equal(addOne(-2))
        })
    })
})