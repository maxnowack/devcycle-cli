import { executeFileDiff } from '../../diff/fileDiff'
import * as path from 'node:path'
import { parseFiles } from '../../diff/parse'
import { expect } from '@oclif/test'

describe('react', () => {
    let simpleMatchResult = [
        {
            'fileName': 'test-utils/fixtures/diff/sampleDiff.jsx',
            'line': 1,
            'mode': 'add',
            'name': 'simple-case'
        },
        {
            'fileName': 'test-utils/fixtures/diff/sampleDiff.jsx',
            'line': 3,
            'mode': 'add',
            'name': 'multi-line'
        },
        {
            'fileName': 'test-utils/fixtures/diff/sampleDiff.jsx',
            'isUnknown': true,
            'line': 8,
            'mode': 'add',
            'name': 'ALIASED_VARIABLE'
        }
    ]
    simpleMatchResult = simpleMatchResult.concat(simpleMatchResult.map((match) => {
        return { ...match, line: match.line + 9 }
    }))

    it('identifies the correct variable usages in the React sample diff', () => {
        const parsedDiff = executeFileDiff(path.join(__dirname, '../../../../test-utils/fixtures/diff/react'))
        const results = parseFiles(parsedDiff)

        expect(results).to.deep.equal({
            react: simpleMatchResult,
        })
    })
})
