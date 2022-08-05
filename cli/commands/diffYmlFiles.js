import { exec } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import util from 'util'

const execAsync = util.promisify(exec)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const diffYmlFiles = async () => {
  try {
    const { stdout, stderr } = await execAsync('git diff origin/main --name-only')

    if (stderr) {
      console.error('Something went wrong getting the changed files:', stderr)

      return
    }

    if (stdout) {
      const changedFiles = stdout.split('\n')
      const ymlFiles = changedFiles.filter(
        (file) => file.startsWith('openapi/contracts/') && file.endsWith('.yml'),
      )

      if (ymlFiles.length === 0) {
        console.log('No yml files changed')

        return
      }

      const finalFiles = ymlFiles.map((file) => ({
        absoluteFile: join(__dirname, '../../', file),
        relativeFile: file,
      }))

      console.log('Detected changes in the following files: ', ymlFiles.join(', '))
      return finalFiles
    }
  } catch (error) {
    console.error('Something went wrong getting the changed files:', error)
  }
}
