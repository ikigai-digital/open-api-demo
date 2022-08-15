import fetch from 'node-fetch'
import { exec } from 'child_process'
import fs from 'fs'
import util from 'util'
import yaml from 'yaml'
import { pipeline } from 'stream'
import { join } from 'path'

import { diffYmlFiles } from './diffYmlFiles.js'
import {
  MISSING_JFROG_CREDENTIALS,
  NO_CONFIG_FILE,
  INVALID_CONFIG_FILE,
  INVALID_PLATFORM,
  NO_CONTRACTS_PROVIDED,
  MISSING_FIELDS_IN_CONTRACT,
  INVALID_CONTRACT_TYPE,
} from '../constants/errors.js'
import { logger } from '../utils/logger.js'

const execAsync = util.promisify(exec)
const streamPipeline = util.promisify(pipeline)

const JFROG_USERNAME = process.env.JFROG_USERNAME
const JFROG_API_KEY = process.env.JFROG_API_KEY

const DEFAULT_OUTPUT_DIR = './generated'
const TMP_DIR = 'tmp'
const REQUIRED_CONTRACT_FIELDS = ['type', 'boundedContext', 'name', 'version']
const CONTRACT_TYPES = ['provider', 'client']

const generateSingleFile = async ({ filePath, type, buildDir, name }) => {
  try {
    const generatorType = type === 'provider' ? 'nodejs-express-server' : 'typescript-axios'
    console.log({
      filePath,
      type,
      buildDir,
      name,
    })

    const { stdout, stderr } = await execAsync(
      `npx @openapitools/openapi-generator-cli generate -i ${filePath} -g ${generatorType} -o ${buildDir}  --additional-properties=npmName=@ikigai-digital/${name},npmRepository=https://idigital.jfrog.io/artifactory/api/npm/shared-npm,supportsES6=false,withInterfaces=true --git-repo-id open-api-demo --git-user-id ikigai-digital`,
    )

    if (stderr) {
      logger.error(`Failed to generate ${type} for file at path ${filePath} with error: `, stderr)

      return
    }

    if (stdout) {
      logger.success(`Successfully generated ${type} for file: `, filePath)
    }
  } catch (error) {
    logger.error(
      `Failed to generate ${type} for file at path ${filePath} with error: `,
      error.message,
    )
  }
}

const fetchAndGenerateFiles = async (parsedConfigFile, pwd) => {
  const outputDir = join(pwd, parsedConfigFile.outputDir || DEFAULT_OUTPUT_DIR)
  const contracts = Object.keys(parsedConfigFile.contracts).map((key) => ({
    ...parsedConfigFile.contracts[key],
    parentKey: key,
  }))

  for (const { boundedContext, type, name, version } of contracts) {
    const jfrogDir = `${boundedContext}/${name}/${version}`
    const jfrogPath = `${jfrogDir}/swagger.yaml`
    logger.success('Fetching swagger file from JFrog: ', jfrogPath)
    const response = await fetch(
      `https://idigital.jfrog.io/artifactory/contracts-generic-local/openapi/${jfrogPath}`,
      {
        headers: {
          Authorization: 'Basic ' + btoa(`${JFROG_USERNAME}:${JFROG_API_KEY}`),
        },
      },
    )

    if (!response.ok) {
      logger.error(`Failed to fetch swagger file from JFrog: ${jfrogPath}`)
    }

    const tmpFileDir = `${TMP_DIR}/${jfrogDir}`

    if (!fs.existsSync(tmpFileDir)) {
      fs.mkdirSync(tmpFileDir, { recursive: true })
    }

    logger.info('Writing swagger file to tmp directory: ', tmpFileDir)
    const fetchedArtifactPath = `${tmpFileDir}/swagger.yaml`
    await streamPipeline(response.body, fs.createWriteStream(fetchedArtifactPath))

    await generateSingleFile({
      filePath: fetchedArtifactPath,
      buildDir: `${outputDir}/${type}/${jfrogDir}`,
      type,
      name,
    })
  }
}

export const generateFiles = async (options) => {
  const validateGeneratorYaml = (parsedConfigFile) => {
    try {
      if (parsedConfigFile.platform.name !== 'jfrog') {
        logger.error(
          `Invalid platform value ${parsedConfigFile.platform} provided in the config file. Expected one of jfrog, swaggerhub or nexus`,
        )

        throw new Error(INVALID_PLATFORM)
      }

      if (!JFROG_USERNAME || !JFROG_API_KEY) {
        logger.error('Missing jfrog credentials in the config file')

        throw new Error(MISSING_JFROG_CREDENTIALS)
      }

      if (!parsedConfigFile.contracts || Object.keys(parsedConfigFile.contracts).length === 0) {
        logger.error('No contracts provided in the config file')

        throw new Error(NO_CONTRACTS_PROVIDED)
      }

      const contracts = Object.keys(parsedConfigFile.contracts).map((key) => ({
        ...parsedConfigFile.contracts[key],
        parentKey: key,
      }))

      contracts.forEach((contract) => {
        const contractFields = Object.keys(contract)
        const missingFields = REQUIRED_CONTRACT_FIELDS.filter(
          (field) => !contractFields.includes(field),
        )

        if (missingFields.length) {
          logger.error(
            `Missing required fields [${missingFields}] in contract ${contract.parentKey}`,
          )

          throw new Error(MISSING_FIELDS_IN_CONTRACT)
        }

        if (!CONTRACT_TYPES.includes(contract.type)) {
          logger.error(
            `Invalid contract type ${contract.type} provided in the config file. Expected one of provider or client`,
          )

          throw new Error(INVALID_CONTRACT_TYPE)
        }
      })

      return true
    } catch (error) {
      logger.error(
        `Failed to parse config file at path ${configFilePath} with error: `,
        error.message,
      )

      return false
    }
  }

  try {
    if (!options.config || !fs.existsSync(options.config)) {
      throw new Error(NO_CONFIG_FILE)
    }

    const rawYamlFile = fs.readFileSync(options.config, 'utf8')
    const parsedConfigFile = yaml.parse(rawYamlFile)

    const isYamlValid = validateGeneratorYaml(parsedConfigFile)

    if (!isYamlValid) {
      throw new Error(INVALID_CONFIG_FILE)
    }

    if (!fs.existsSync(TMP_DIR)) {
      fs.mkdirSync(TMP_DIR)
    }

    await fetchAndGenerateFiles(parsedConfigFile, process.cwd())
  } catch (error) {
    logger.error(`Something went wrong generating the files: `, error.message)

    throw error
  } finally {
    if (fs.existsSync(TMP_DIR)) {
      logger.warn(`Cleaning up ${TMP_DIR} directory`)
      fs.rm(TMP_DIR, { recursive: true }, (err) => {
        if (err) {
          logger.error(`Failed to clean up ${TMP_DIR} directory: `, err)
          return
        }
        logger.success(`Successfully cleaned up ${TMP_DIR} directory`)
      })
    }
  }
}
