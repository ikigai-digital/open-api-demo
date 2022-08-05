import { exec } from 'child_process'
import fs from 'fs'
import util from 'util'

import { diffYmlFiles } from './diffYmlFiles.js'
import { SPEC_DELETED } from '../constants/errors.js'
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

      if (ymlFiles && ymlFiles.length) {
        ymlFiles.forEach((filePath) => {
          if (fs.existsSync(filePath.absoluteFile)) {
            validateSingleFile(filePath.absoluteFile)
            return
          }

          if (options.force) {
            logger.success(
              'Successfully validated recently deleted file since spec deletion is allowed: ',
              filePath.relativeFile,
            )

            return
          }

          logger.error(
            'Failed to validate recently deleted file since spec deletion is not allowed: ',
            filePath.relativeFile,
          )

          throw new Error(SPEC_DELETED)
        })
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
