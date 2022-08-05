import { exec } from 'child_process'
import util from 'util'

import { diffYmlFiles } from './diffYmlFiles.js'
import { getAllYmlFiles } from '../utils/getAllYmlFiles.js'
import { logger } from '../utils/logger.js'

const execAsync = util.promisify(exec)

const validateSingleFile = async (filePath) => {
  try {
    const { stdout, stderr } = await execAsync(
      `npx @openapitools/openapi-generator-cli validate -i ${filePath}`,
    )

    if (stderr) {
      logger.error(`Failed to validate file at path ${filePath} with error: `, stderr)

      return
    }

    if (stdout) {
      logger.success('Successfully validated file: ', filePath)
    }
  } catch (error) {
    logger.error(`Failed to validate file at path ${filePath} with error: `, error)
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

      if (ymlFiles.length) {
        ymlFiles.forEach((filePath) => validateSingleFile(filePath.absoluteFile))
      }

      return
    }

    const ymlFiles = await getAllYmlFiles()

    if (ymlFiles) {
      ymlFiles.forEach((filePath) => validateSingleFile(filePath))
    }
  } catch (error) {
    logger.error('Something went wrong validating files: ', error)
  }
}
