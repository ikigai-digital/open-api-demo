#!/usr/bin/env node
import { program } from 'commander'
import { diffYmlFiles } from './commands/diffYmlFiles.js'
import { validate } from './commands/validate.js'

program.description('CLI tools for common openapi actions')
program.name('openapi')
program.usage('<command>')
program.addHelpCommand(false)
program.helpOption(false)

program.command('diff-yml').action(diffYmlFiles)
program
  .command('validate')
  .option('-d, --diff', 'Run validate on all changed yml files')
  .option('-i, --inputSpec', 'Single spec file to validate')
  .action(validate)

program.parse(process.argv)
