import fs from 'fs'
import openapiDiff from 'openapi-diff'
import yaml from 'yaml'

import { diffYmlFiles } from './diffYmlFiles.js'

const validateSingleVersionBump = async (filePath) => {
  try {
    console.log('Validating file: ', filePath)
    const rawYaml = fs.readFileSync(filePath, 'utf8')
    const parsedYaml = yaml.parse(rawYaml)

    const result = await openapiDiff.diffSpecs({
      sourceSpec: {
        content: rawYaml,
        location: 'old.yml',
        format: 'openapi3',
      },
      destinationSpec: {
        content: rawYaml,
        location: 'new.yml',
        format: 'openapi3',
      },
    })

    const isBreaking = result.breakingDifferencesFound
    const newVersion = parsedYaml.info.version

    console.log({ result, isBreaking, parsedYaml })
  } catch (error) {
    console.error(`Failed to validate version of file at path ${filePath} with error: `, error)
  }
}

export const validateVersionBump = async (options) => {
  try {
    if (options.inputSpec) {
      await validateSingleVersionBump(options.inputSpec)

      return
    }

    const ymlFiles = await diffYmlFiles()

    if (ymlFiles) {
      ymlFiles.forEach((filePath) => validateSingleVersionBump(filePath))
    }
  } catch (error) {
    console.error('Something went wrong validating versions files: ', error)
  }
}
