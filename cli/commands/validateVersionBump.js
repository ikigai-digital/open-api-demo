import { exec } from 'child_process'
import fs from 'fs'
import openapiDiff from 'openapi-diff'
import util from 'util'
import semver from 'semver'
import yaml from 'yaml'

import { diffYmlFiles } from './diffYmlFiles.js'
import {
  BREAKING_CHANGES,
  NO_VERSION_BUMP,
  SPEC_DELETED,
  INVALID_VERSION_BUMP,
} from '../constants/errors.js'
import { logger } from '../utils/logger.js'

const execAsync = util.promisify(exec)

const TMP_DIR = 'tmp'

const validateSingleVersionBump = async (filePaths) => {
  try {
    logger.warn('Validating file: ', filePaths.relativeFile)
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
        logger.error(`Breaking change detected in ${filePaths.relativeFile}`)
        logger.info(JSON.stringify(result.breakingDifferences, null, 4))

        throw Error(BREAKING_CHANGES)
      }

      if (newVersion === oldVersion) {
        logger.error(`No version bump detected in ${filePaths.relativeFile}`)
        logger.info('Spec changes need to be accompanied by a version bump')
        logger.info({ newVersion, oldVersion })

        throw Error(NO_VERSION_BUMP)
      }

      if (!semver.valid(newVersion) || semver.lt(oldVersion, newVersion)) {
        logger.error(`Invalid version bump detected in ${filePaths.relativeFile}`)
        logger.info(
          'Version bump needs to be a valid semver version and greater than the previous version',
        )
        logger.info({ newVersion, oldVersion })

        throw Error(INVALID_VERSION_BUMP)
      }
    }

    logger.success('No issues found!')
  } catch (error) {
    logger.error(
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

    if (ymlFiles && ymlFiles.length) {
      for (const filePaths of ymlFiles) {
        if (fs.existsSync(filePaths.absoluteFile)) {
          await validateSingleVersionBump(filePaths)

          return
        }

        if (options.force) {
          logger.success(
            'Successfully validated recently deleted file since spec deletion is allowed: ',
            filePaths.relativeFile,
          )

          return
        }

        logger.error(
          'Failed to validate recently deleted file since spec deletion is not allowed: ',
          filePaths.relativeFile,
        )

        throw new Error(SPEC_DELETED)
      }
    }
  } catch (error) {
    logger.error('Something went wrong validating versions files: ', error)
  } finally {
    if (fs.existsSync(TMP_DIR)) {
      fs.rmdirSync(TMP_DIR, { recursive: true })
    }
  }
}
