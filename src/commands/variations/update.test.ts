import { expect } from '@oclif/test'
import inquirer from 'inquirer'
import { dvcTest, setCurrentTestFile } from '../../../test-utils'
import { BASE_URL } from '../../api/common'
import chai from 'chai'
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot'

describe('variations update', () => {
    beforeEach(setCurrentTestFile(__filename))
    chai.use(jestSnapshotPlugin())
    const projectKey = 'test-project'
    const authFlags = ['--client-id', 'test-client-id', '--client-secret', 'test-client-secret']
    const featureKey = 'spam'
    const variationKey = 'variation'
    const requestVariables = { 'first-feature': true }

    const requestBody = {
        'name': 'Test Variation',
        'key': 'variation',
        'variables': requestVariables
    }

    const mockVariation = {
        '_id':'63b5eea3e6e91987bae47f40',
        'key':'variation',
        'name':'Test CLI',
        'variables': {
            'new-variable':false,
            'first-feature':true
        }
    }

    const mockVariables = [{
        '_id':'6490c827e1fc7729fbfb5e20',
        '_project':'63b5ee5de6e91987bae47f01',
        '_feature':'63b5eea3e6e91987bae47f3a',
        'name':'new-variable',
        'key':'new-variable',
        'type':'Boolean',
        'status':'active',
        'source':'dashboard',
        '_createdBy':'google-oauth2|111559006563333334214',
        'createdAt':'2023-06-19T21:27:03.796Z',
        'updatedAt':'2023-06-19T21:27:03.796Z'
    }, {
        '_id':'63b5eea3e6e91987bae47f3c',
        '_project':'63b5ee5de6e91987bae47f01',
        '_feature':'63b5eea3e6e91987bae47f3a',
        'name':'first-feature',
        'key':'first-feature',
        'type':'Boolean',
        'status':'active',
        'defaultValue':false,
        'source':'dashboard',
        '_createdBy':'google-oauth2|111559006563333334214',
        'createdAt':'2023-01-04T21:24:51.877Z',
        'updatedAt':'2023-01-04T21:24:51.877Z'
    }]
    const mockFeature = {
        '_id': '63b5eea3e6e91987bae47f3a',
        '_project': '63b5ee5de6e91987bae47f01',
        'source': 'dashboard',
        'type': 'experiment',
        'name': 'First Feature',
        'description': '',
        '_createdBy': 'google-oauth2|111559006563333334214',
        'createdAt': '2023-01-04T21:24:51.870Z',
        'updatedAt': '2023-06-16T19:27:14.862Z',
        'variations': [
            {
                '_id': '63b5eea3e6e91987bae47f40',
                'key': 'yo',
                'name': 'Yo',
                'variables': {
                    'new-variable':false,
                    'first-feature':true
                }
            },
            {
                '_id': '63b5eea3e6e91987bae47f41',
                'key': 'variation-a',
                'name': 'Variation A',
                'variables': {}
            },
            {
                '_id': '63b5eea3e6e91987bae47f42',
                'key': 'variation-b',
                'name': 'Variation B',
                'variables': {}
            }
        ],
        'controlVariation': 'control',
        'variables': [
            {
                '_id': '63b5eea3e6e91987bae47f3c',
                '_project': '63b5ee5de6e91987bae47f01',
                '_feature': '63b5eea3e6e91987bae47f3a',
                'name': 'first-feature',
                'key': 'first-feature',
                'type': 'Boolean',
                'status': 'active',
                'defaultValue': false,
                'source': 'dashboard',
                '_createdBy': 'google-oauth2|111559006563333334214',
                'createdAt': '2023-01-04T21:24:51.877Z',
                'updatedAt': '2023-01-04T21:24:51.877Z'
            }
        ],
        'tags': [],
        'readonly': false,
        'settings': {
            'optInEnabled': false,
            'publicName': '',
            'publicDescription': ''
        },
        'sdkVisibility': {
            'client': false,
            'mobile': false,
            'server': true
        }
    }
    dvcTest()
        .nock(BASE_URL, (api) => api
            .get(`/v1/projects/${projectKey}/features/${featureKey}/variations/${variationKey}`)
            .reply(200, mockVariation)
        )
        .nock(BASE_URL, (api) => api
            .get(`/v1/projects/${projectKey}/features/${featureKey}`)
            .reply(200, mockFeature)
        )
        .nock(BASE_URL, (api) => api
            .get(`/v1/projects/${projectKey}/variables?feature=63b5eea3e6e91987bae47f3a`)
            .reply(200, mockVariables)
        )
        .nock(BASE_URL, (api) => api
            .patch(`/v1/projects/${projectKey}/features/${featureKey}/variations/${variationKey}`, requestBody)
            .reply(200, mockFeature)
        )
        .stdout()
        .command([
            'variations update', featureKey, variationKey.toUpperCase(),
            '--project', projectKey,
            '--name', requestBody.name,
            '--key', requestBody.key.toUpperCase(),
            '--variables', JSON.stringify(requestVariables),
            '--headless',
            ...authFlags
        ])
        .it('updates a variation and returns the full feature in headless mode',
            (ctx) => {
                expect(ctx.stdout).toMatchSnapshot()
            })

    dvcTest()
        .nock(BASE_URL, (api) => api
            .get(`/v1/projects/${projectKey}/features/${featureKey}/variations/${variationKey}`)
            .reply(200, mockVariation)
        )
        .nock(BASE_URL, (api) => api
            .get(`/v1/projects/${projectKey}/features/${featureKey}`)
            .reply(200, mockFeature)
        )
        .nock(BASE_URL, (api) => api
            .get(`/v1/projects/${projectKey}/variables?feature=63b5eea3e6e91987bae47f3a`)
            .reply(200, mockVariables)
        )
        .nock(BASE_URL, (api) => api
            .patch(`/v1/projects/${projectKey}/features/${featureKey}/variations/${variationKey}`, requestBody)
            .reply(200, mockFeature)
        )
        .stdout()
        .command([
            'variations update', featureKey, variationKey,
            '--project', projectKey,
            '--name', requestBody.name,
            '--key', requestBody.key,
            '--variables', JSON.stringify(requestVariables),
            ...authFlags
        ])
        .it('updates a variation and returns the full feature in interactive mode',
            (ctx) => {
                expect(ctx.stdout).toMatchSnapshot()
            })

    dvcTest()
        .nock(BASE_URL, (api) => api
            .get(`/v1/projects/${projectKey}/features/${featureKey}/variations/${variationKey}`)
            .reply(200, mockVariation)
        )
        .nock(BASE_URL, (api) => api
            .get(`/v1/projects/${projectKey}/features/${featureKey}`)
            .reply(200, mockFeature)
        )
        .nock(BASE_URL, (api) => api
            .get(`/v1/projects/${projectKey}/variables?feature=63b5eea3e6e91987bae47f3a`)
            .reply(200, mockVariables)
        )
        .nock(BASE_URL, (api) => api
            .patch(`/v1/projects/${projectKey}/features/${featureKey}/variations/${variationKey}`, requestBody)
            .reply(200, mockFeature)
        )

        .stub(inquirer, 'registerPrompt', () => { return })
        .stub(inquirer, 'prompt',  () => {
            return {
                whichFields: ['variables'],
                variables: [mockVariables[1]],
                'first-feature': true
            }
        })
        .stdout()
        .command([
            'variations update', featureKey, variationKey,
            '--project', projectKey,
            '--name', requestBody.name,
            '--key', requestBody.key,
            ...authFlags
        ])
        .it('prompts for variables when missing in interactive mode',
            (ctx) => {
                expect(ctx.stdout).toMatchSnapshot()
            })
})
