import { exec } from 'child_process'
import fs from 'fs'
import openapiDiff from 'openapi-diff'
import util from 'util'
import yaml from 'yaml'

import { diffYmlFiles } from './diffYmlFiles.js'
import { BREAKING_CHANGES, NO_VERSION_BUMP } from '../constants/errors.js'

const execAsync = util.promisify(exec)

const TMP_DIR = 'tmp'

// git --work-tree tmp/ restore -s origin/main openapi/contracts/inventory/openapi/inventoryApi/v1.yml

const validateSingleVersionBump = async (filePaths) => {
  try {
    console.log('Validating file: ', filePaths.relativeFile)
    const tmpFilePath = `${TMP_DIR}/${filePaths.relativeFile}`

    // Fetching the file from the repository
    await execAsync(`git --work-tree tmp/ restore -s origin/main ${filePaths.relativeFile}`)

    let fileExistsInGit = fs.existsSync(tmpFilePath)

    const rawDestYaml = fs.readFileSync(filePaths.absoluteFile, 'utf8')
    const parsedDestYaml = yaml.parse(rawDestYaml)

    if (fileExistsInGit) {
      const rawSourceYaml = fs.readFileSync(tmpFilePath, 'utf8')
      const parsedSourceYaml = yaml.parse(rawSourceYaml)

      const result = await openapiDiff.diffSpecs({
        sourceSpec: {
          content: rawSourceYaml,
          location: 'old.yml',
          format: 'openapi3',
        },
        destinationSpec: {
          content: rawDestYaml,
          location: 'new.yml',
          format: 'openapi3',
        },
      })

      const isBreaking = result.breakingDifferencesFound
      const oldVersion = parsedSourceYaml.info.version
      const newVersion = parsedDestYaml.info.version

      if (isBreaking) {
        console.error(`Breaking change detected in ${filePaths.relativeFile}`)
        console.log(
          'Breaking changes detected, breaking changes need to committed with major version bump and a new a new spec file',
        )
        console.log(result.differences)

        throw Error(BREAKING_CHANGES)
      }

      if (newVersion === oldVersion) {
        console.error(`No version bump detected in ${filePaths.relativeFile}`)
        console.log('Spec changes need to be accompanied by a version bump')
        console.log(result.differences)

        throw Error(NO_VERSION_BUMP)
      }
      //   console.log({ result, isBreaking, parsedSourceYaml, parsedDestYaml, oldVersion, newVersion })
    }

    console.log('No issues found!')
  } catch (error) {
    console.error(
      `Failed to validate version of file at path ${filePaths.relativeFile} with error: `,
      error,
    )
  }
}

export const validateVersionBump = async (options) => {
  try {
    if (!fs.existsSync(TMP_DIR)) {
      fs.mkdirSync(TMP_DIR)
    }

    if (options.inputSpec) {
      await validateSingleVersionBump(options.inputSpec)

      return
    }

    const ymlFiles = await diffYmlFiles()

    if (ymlFiles.length) {
      for (const filePaths of ymlFiles) {
        await validateSingleVersionBump(filePaths)
      }
    }
  } catch (error) {
    console.error('Something went wrong validating versions files: ', error)
  }
}
