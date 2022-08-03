#!/usr/bin/env node
import { program } from 'commander'
import { diffYmlFiles } from './commands/diffYmlFiles.js'

program.description('CLI tools for common openapi actions')
program.name('openapi')
program.usage('<command>')
program.addHelpCommand(false)
program.helpOption(false)

program
  .command('diff-yml')
  .argument('[postId]', "ID of post you'd like to retrieve.")
  .option('-p, --pretty', 'Pretty-print output from the API.')
  .description(
    'Get list of touched yml files and display the differences between master and current branch',
  )
  .action(diffYmlFiles)

program.parse(process.argv)
