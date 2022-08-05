import { exec } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import util from 'util'

const execAsync = util.promisify(exec)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const getAllYmlFiles = async () => {
  try {
    const { stdout, stderr } = await execAsync('find openapi/contracts -name *.yml')

    if (stderr) {
      console.error('Something went wrong getting all the yml files: ', stderr)

      return
    }

    if (stdout) {
      const ymlFiles = stdout.split('\n').filter((file) => file.length > 0)

      if (ymlFiles.length === 0) {
        console.log('No yml files detected')

        return
      }

      const finalFiles = ymlFiles.map((file) => join(__dirname, '../../', file))

      console.log('Openapi specs found at locations: ', finalFiles.join(', '))
      return finalFiles
    }
  } catch (error) {
    console.error('Something went wrong getting all the yml files: ', error)
  }
}
