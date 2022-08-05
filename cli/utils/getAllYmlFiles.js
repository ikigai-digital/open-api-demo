import { exec } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import util from 'util'

import { logger } from './logger.js'

const execAsync = util.promisify(exec)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const getAllYmlFiles = async () => {
  try {
    const { stdout, stderr } = await execAsync('find openapi/contracts -name *.yml')

    if (stderr) {
      logger.error('Something went wrong getting all the yml files: ', stderr)

      return
    }

    if (stdout) {
      const ymlFiles = stdout.split('\n').filter((file) => file.length > 0)

      if (ymlFiles.length === 0) {
        logger.info('No yml files detected')

        return
      }

      const finalFiles = ymlFiles.map((file) => join(__dirname, '../../', file))

      logger.info('Openapi specs found at locations: ', finalFiles.join(', '))
      return finalFiles
    }
  } catch (error) {
    logger.error('Something went wrong getting all the yml files: ', error)
  }
}
