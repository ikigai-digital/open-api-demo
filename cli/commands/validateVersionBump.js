import { exec } from 'child_process'
import fs from 'fs'
import openapiDiff from 'openapi-diff'
import util from 'util'
import yaml from 'yaml'

import { diffYmlFiles } from './diffYmlFiles.js'

const execAsync = util.promisify(exec)

const TMP_DIR = 'tmp'

// git --work-tree tmp/ restore -s origin/main openapi/contracts/inventory/openapi/inventoryApi/v1.yml

const validateSingleVersionBump = async (filePaths) => {
  try {
    console.log('Validating file: ', filePaths.relativeFile)
    let fileExistsInGit = false

    // Fetching the file from the repository
    const { stderr } = await execAsync(
      `git --work-tree tmp/ restore -s origin/main ${filePaths.relativeFile}`,
    )

    if (stderr) {
      console.error('Contract not found, skipping checking for patch and minor bumps')
      fileExistsInGit = false
    } else {
      fileExistsInGit = true
    }

    const rawDestYaml = fs.readFileSync(filePaths.absoluteFile, 'utf8')
    const parsedDestYaml = yaml.parse(rawDestYaml)

    if (fileExistsInGit) {
      const rawSourceYaml = fs.readFileSync(`${TMP_DIR}/${filePaths.relativeFile}`, 'utf8')
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
      console.log({ result, isBreaking, parsedSourceYaml, parsedDestYaml, oldVersion, newVersion })
    }
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
      ymlFiles.forEach((filePaths) => validateSingleVersionBump(filePaths))
    }
    console.log(ymlFiles)
  } catch (error) {
    console.error('Something went wrong validating versions files: ', error)
  }
}
