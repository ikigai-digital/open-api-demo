import fetch from 'node-fetch'
import fs from 'fs'
import yaml from 'yaml'

import { diffYmlFiles } from './diffYmlFiles.js'
import {
  MISSING_JFROG_CREDENTIALS,
  SPEC_ALREADY_EXISTS_IN_ARTIFACTORY,
} from '../constants/errors.js'
import { getAllYmlFiles } from '../utils/getAllYmlFiles.js'
import { logger } from '../utils/logger.js'

const JFROG_USERNAME = process.env.JFROG_USERNAME
const JFROG_API_KEY = process.env.JFROG_API_KEY

const publishSingleSpec = async (filePath) => {
  try {
    const filePathArr = filePath.split('/')
    const apiName = filePathArr[filePathArr.length - 2]
    const bc = filePathArr[filePathArr.length - 4]
    const rawDestYaml = fs.readFileSync(filePath, 'utf8')
    const parsedDestYaml = yaml.parse(rawDestYaml)
    const version = parsedDestYaml.info.version
    const jfrogPath = `${bc}/${apiName}/${version}/swagger.yaml`

    logger.info('Checking if spec already exists in artifactory')
    const getSpecResponse = await fetch(
      `https://idigital.jfrog.io/artifactory/contracts-generic-local/openapi/${jfrogPath}`,
      {
        headers: {
          Authorization: 'Basic ' + btoa(`${JFROG_USERNAME}:${JFROG_API_KEY}`),
        },
      },
    )

    if (getSpecResponse.status === 404) {
      const fileStats = fs.statSync(filePath)
      let readStream = fs.createReadStream(filePath)

      logger.info(`Publishing to ${jfrogPath}`)
      const publishResponse = await fetch(
        `https://idigital.jfrog.io/artifactory/contracts-generic-local/openapi/${jfrogPath}`,
        {
          method: 'PUT',
          headers: {
            Authorization: 'Basic ' + btoa(`${JFROG_USERNAME}:${JFROG_API_KEY}`),
            'Content-length': fileStats.size,
          },
          body: readStream,
        },
      )

      if (publishResponse.status === 201 || publishResponse.status === 200) {
        logger.success('Successfully published file: ', filePath)

        return
      }
    }

    logger.error('Spec already exists in artifactory at path: ', getSpecResponse.url)
    throw new Error(SPEC_ALREADY_EXISTS_IN_ARTIFACTORY)
  } catch (error) {
    logger.error(`Failed to publish file at path ${filePath} with error: `, error.message)

    throw error
  }
}

export const publish = async (options) => {
  try {
    if (options.platform !== 'jfrog') {
      return
    }

    if (!JFROG_USERNAME || !JFROG_API_KEY) {
      logger.error('JFROG_USERNAME or JFROG_API_KEY is not set')

      throw new Error(MISSING_JFROG_CREDENTIALS)
    }

    if (options.inputSpec) {
      await publishSingleSpec(options.inputSpec)

      return
    }

    if (options.diff) {
      const ymlFiles = await diffYmlFiles()

      if (ymlFiles && ymlFiles.length) {
        ymlFiles.forEach((filePath) => {
          if (fs.existsSync(filePath.absoluteFile)) {
            publishSingleSpec(filePath.absoluteFile)
            return
          }
        })
      }

      return
    }

    const ymlFiles = await getAllYmlFiles()

    if (ymlFiles) {
      ymlFiles.forEach((filePath) => publishSingleSpec(filePath))
    }
  } catch (error) {
    logger.error('Something went wrong publishing files: ', error.message)

    throw error
  }
}
