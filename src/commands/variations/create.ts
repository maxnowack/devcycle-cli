import inquirer from 'inquirer'
import { Args, Flags } from '@oclif/core'
import {
    featurePrompt,
    keyPrompt,
    namePrompt
} from '../../ui/prompts'
import CreateCommand from '../createCommand'
import { CreateVariationDto } from '../../api/schemas'
import { createVariation } from '../../api/variations'
import { promptForVariationVariableValues } from '../../ui/prompts/variationPrompts'
import { fetchVariables } from '../../api/variables'

export default class CreateVariation extends CreateCommand {
    static hidden = false
    static description = 'Create a new Variation'

    static args = {
        feature: Args.string({
            name: 'feature',
            description: 'Feature key or id'
        })
    }

    static flags = {
        ...CreateCommand.flags,
        'variables': Flags.string({
            description: 'The variables to create for the variation'
        }),
    }

    static examples = [
        '<%= config.bin %> <%= command.id %>',
        '<%= config.bin %> <%= command.id %> --variables=\'{ "bool-var": true, "num-var": 80, "string-var": "test" }\''
    ]

    prompts = [namePrompt, keyPrompt]

    public async run(): Promise<void> {
        await this.requireProject()

        const { args, flags } = await this.parse(CreateVariation)
        const { headless, key, name, variables } = flags

        let featureKey
        if (!args.feature) {
            const { feature } = await inquirer.prompt([featurePrompt], {
                token: this.authToken,
                projectKey: this.projectKey
            })

            featureKey = feature
        } else {
            featureKey = args.feature
        }

        const params = await this.populateParametersWithZod(
            CreateVariationDto,
            this.prompts, {
                key,
                name,
                headless
            }
        )

        let variableAnswers: Record<string, unknown> = {}
        if (!variables) {
            const variablesForFeature = await fetchVariables(this.authToken, this.projectKey, featureKey)
            variableAnswers = await promptForVariationVariableValues(
                variablesForFeature
            )
        }

        const variation = {
            key: params.key,
            name: params.name,
            variables: variables ? JSON.parse(variables) : variableAnswers
        }

        const result = await createVariation(this.authToken, this.projectKey, featureKey, variation)
        this.writer.showResults(result)
    }
}
