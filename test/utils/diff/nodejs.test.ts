import { executeFileDiff } from '../../../src/utils/diff/fileDiff'
import * as path from 'node:path'
import { parseFiles } from '../../../src/utils/diff/parse'
import { expect } from '@oclif/test'

describe('nodejs', () => {
    it('identifies the correct variable usages in the NodeJS sample diff', () => {
        const parsedDiff = executeFileDiff(path.join(__dirname, './samples/nodeSampleDiff'))
        const results = parseFiles(parsedDiff)

        expect(results).to.deep.equal({
            nodejs: [{
                'fileName': 'test/utils/diff/sampleDiff.js',
                'line': 1,
                'mode': 'add',
                'name': 'simple-case'
            },
            {
                'fileName': 'test/utils/diff/sampleDiff.js',
                'line': 2,
                'mode': 'add',
                'name': 'simple-case'
            },
            {
                'fileName': 'test/utils/diff/sampleDiff.js',
                'line': 4,
                'mode': 'add',
                'name': 'single-quotes'
            },
            {
                'fileName': 'test/utils/diff/sampleDiff.js',
                'line': 16,
                'mode': 'add',
                'name': 'single-comment'
            },
            {
                'fileName': 'test/utils/diff/sampleDiff.js',
                'line': 19,
                'mode': 'add',
                'name': 'multi-line-comment'
            },
            {
                'fileName': 'test/utils/diff/sampleDiff.js',
                'line': 1,
                'mode': 'remove',
                'name': 'simple-case'
            }],
        })
    })
})
