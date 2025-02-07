import { executeFileDiff } from '../../diff/fileDiff'
import * as path from 'node:path'
import { parseFiles } from '../../diff/parse'
import { expect } from '@oclif/test'

describe('csharp', () => {
    let simpleMatchResult = [
        {
            'fileName': 'test-utils/fixtures/diff/sampleDiff.cs',
            'line': 1,
            'mode': 'add',
            'name': 'simple-case'
        },
        {
            'fileName': 'test-utils/fixtures/diff/sampleDiff.cs',
            'line': 3,
            'mode': 'add',
            'name': 'multi-line'
        },
        {
            'fileName': 'test-utils/fixtures/diff/sampleDiff.cs',
            'line': 10,
            'mode': 'add',
            'name': 'user-object'
        },
        {
            'fileName': 'test-utils/fixtures/diff/sampleDiff.cs',
            'line': 11,
            'mode': 'add',
            'name': 'named-case'
        },
        {
            'fileName': 'test-utils/fixtures/diff/sampleDiff.cs',
            'line': 12,
            'mode': 'add',
            'name': 'unordered-named-case'
        },
        {
            'fileName': 'test-utils/fixtures/diff/sampleDiff.cs',
            'line': 13,
            'mode': 'add',
            'name': 'default-value-object'
        }
    ]
    simpleMatchResult = simpleMatchResult.concat(simpleMatchResult.map((match) => {
        return { ...match, line: match.line + 14 }
    }))

    it('identifies the correct variable usages in the C# sample diff', () => {
        const parsedDiff = executeFileDiff(path.join(__dirname, '../../../../test-utils/fixtures/diff/csharp'))
        const results = parseFiles(parsedDiff)

        expect(results).to.deep.equal({
            csharp: simpleMatchResult,
        })
    })
})
