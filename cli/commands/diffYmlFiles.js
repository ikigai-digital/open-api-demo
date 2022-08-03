import { exec } from 'child_process'
import util from 'util'
const execAsync = util.promisify(exec)

export const diffYmlFiles = async () => {
  try {
    const { stdout, stderr } = await execAsync('git diff-tree --no-commit-id --name-only -r main')

    if (stderr) {
      console.error('Something went wrong getting the changed files:', stderr)

      return
    }

    if (stdout) {
      const changedFiles = stdout.split('\n')
      const ymlFiles = changedFiles.filter((file) => file.endsWith('.yml'))

      if (ymlFiles.length === 0) {
        console.log('No yml files changed')

        return
      }

      console.log({ ymlFiles })
    }
    console.log(stdout)
  } catch (error) {
    console.error('Something went wrong getting the changed files:', error)
  }
}
