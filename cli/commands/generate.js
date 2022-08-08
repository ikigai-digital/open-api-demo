import { exec } from 'child_process'
import fs from 'fs'
import util from 'util'

import { diffYmlFiles } from './diffYmlFiles.js'
import { SPEC_DELETED } from '../constants/errors.js'
import { logger } from '../utils/logger.js'

const execAsync = util.promisify(exec)

const generateSingleFile = async (filePath) => {
  try {
    const buildDir = filePath.replace('.yml', '')
    const buildDirArr = buildDir.split('/')
    const npmName = buildDirArr[buildDirArr.length - 1]

    console.log({
      npmName,
      buildDir,
      filePath,
    })
    const { stdout, stderr } = await execAsync(
      `npx @openapitools/openapi-generator-cli generate -i ${filePath} -g typescript-axios -o build/${buildDir} --additional-properties=npmName=@ikigai-digital/${npmName},npmRepository=https://idigital.jfrog.io/artifactory/api/npm/shared-npm,supportsES6=false,withInterfaces=true --git-repo-id open-api-demo --git-user-id ikigai-digital`,
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

export const generateFiles = async (options) => {
  try {
    if (options.inputSpec) {
      await generateSingleFile(options.inputSpec)

      return
    }

    if (options.diff) {
      const ymlFiles = await diffYmlFiles()

      if (ymlFiles && ymlFiles.length) {
        ymlFiles.forEach((filePath) => {
          if (fs.existsSync(filePath.relativeFile)) {
            generateSingleFile(filePath.relativeFile)
            return
          }

          logger.error(
            'Failed to validate recently deleted file since spec deletion is not allowed: ',
            filePath.relativeFile,
          )

          throw new Error(SPEC_DELETED)
        })
      }
    }
  } catch (error) {
    logger.error('Something went wrong validating files: ', error)
  }
}