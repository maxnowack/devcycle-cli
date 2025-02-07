import { BaseParser } from '../BaseParser'

const userCapturePattern = /(?:\w*|{[^})]*}|new[^)]*\))/
const variableNameCapturePattern = /([^,)]*)/
const defaultValueCapturePattern = /(?:[^),]*|new[^)]*\))/

export class JavaParser extends BaseParser {
    identity = 'java'
    variableMethodPattern = /\??\.(?:(?:variable)|(?:variableValue))\(\s*/
    orderedParameterPatterns = [
        userCapturePattern,
        variableNameCapturePattern,
        defaultValueCapturePattern
    ]

    commentCharacters = ['/**', '*']
}
