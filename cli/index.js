#!/usr/bin/env node
import { program } from 'commander'
import { diffYmlFiles } from './commands/diffYmlFiles.js'
import { validate } from './commands/validate.js'
import { validateVersionBump } from './commands/validateVersionBump.js'

program.description('CLI tools for common openapi actions')
program.name('openapi')
program.usage('<command>')
program.addHelpCommand(false)
program.helpOption(false)

// Detect diff in yml files
program.command('diff-yml').action(diffYmlFiles)

// Validate specific file or all diffed files
program
  .command('validate')
  .option('-d, --diff', 'Run validate on all changed yml files', false)
  .option('-i, --inputSpec <string>', 'Single spec file to validate')
  .option('-a, --all', 'Validate all specs', true)
  .option('-f, --force', 'Allow deletion of specs', false)
  .action(validate)

// Validate version bumps for specific file or all diffed files
program
  .command('validate-version-bump')
  .option('-d, --diff', 'Run validate on all changed yml files')
  .option('-i, --inputSpec <string>', 'Single spec file to validate')
  .action(validateVersionBump)

program.parse(process.argv)
