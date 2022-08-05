import { exec } from 'child_process'
import util from 'util'

import { diffYmlFiles } from './diffYmlFiles.js'
import { getAllYmlFiles } from '../utils/getAllYmlFiles.js'

const execAsync = util.promisify(exec)

const validateSingleFile = async (filePath) => {
  try {
    const { stdout, stderr } = await execAsync(
      `npx @openapitools/openapi-generator-cli validate -i ${filePath}`,
    )

    if (stderr) {
      console.error(`Failed to validate file at path ${filePath} with error: `, stderr)

      return
    }

    if (stdout) {
      console.log('Successfully validated file: ', filePath)
    }
  } catch (error) {
    console.error(`Failed to validate file at path ${filePath} with error: `, error)
  }
}

export const validate = async (options) => {
  try {
    if (options.inputSpec) {
      await validateSingleFile(options.inputSpec)

      return
    }

    if (options.diff) {
      const ymlFiles = await diffYmlFiles()

      if (ymlFiles) {
        ymlFiles.forEach((filePath) => validateSingleFile(filePath))
      }

      return
    }

    const ymlFiles = await getAllYmlFiles()

    if (ymlFiles) {
      ymlFiles.forEach((filePath) => validateSingleFile(filePath))
    }
  } catch (error) {
    console.error('Something went wrong validating files: ', error)
  }
}
