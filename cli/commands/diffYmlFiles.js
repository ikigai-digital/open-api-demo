import { exec } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import util from 'util'

import { logger } from '../utils/logger.js'

const execAsync = util.promisify(exec)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const diffYmlFiles = async () => {
  try {
    const { stdout, stderr } = await execAsync('git diff origin/main --name-only')

    if (stderr) {
      logger.error('Something went wrong getting the changed files: ', stderr)

      return
    }

    if (stdout) {
      const changedFiles = stdout.split('\n')
      const ymlFiles = changedFiles.filter(
        (file) => file.startsWith('openapi/contracts/') && file.endsWith('.yml'),
      )

      if (ymlFiles.length === 0) {
        logger.info('No changed yml files found')

        return
      }

      const finalFiles = ymlFiles.map((file) => ({
        absoluteFile: join(__dirname, '../../', file),
        relativeFile: file,
      }))

      logger.warn('Detected changes in the following files: ', ymlFiles.join(', '))
      return finalFiles
    }
  } catch (error) {
    logger.error('Something went wrong getting the changed files: ', error.message)

    throw error
  }
}
