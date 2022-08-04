import { exec } from 'child_process'
import util from 'util'

import { diffYmlFiles } from './diffYmlFiles.js'
const execAsync = util.promisify(exec)

const validateSingleFile = async (filePath) => {
  try {
    const { stdout, stderr } = await execAsync(`npx openapi-generator-cli validate -i ${filePath}`)

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

export const validate = async (_, options) => {
  try {
    if (options.inputSpec) {
      await validateSingleFile(options.inputSpec)

      return
    }

    const ymlFiles = await diffYmlFiles()

    if (ymlFiles) {
      ymlFiles.forEach((filePath) => validateSingleFile(filePath))
    }
  } catch (error) {
    console.error('Something went wrong validating files: ', error)
  }
}
