#!/usr/bin/env node
import { program } from 'commander'
import { diffYmlFiles } from './commands/diffYmlFiles.js'
import { publish } from './commands/publish.js'
import { validate } from './commands/validate.js'
import { validateVersionBump } from './commands/validateVersionBump.js'
import { generateFiles } from './commands/generate.js'

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
  .option('-d, --diff', 'Run validate on all changed yml files', true)
  .option('-i, --inputSpec <string>', 'Single spec file to validate')
  .option('-f, --force', 'Allow deletion of specs', false)
  .action(validateVersionBump)

// Generate server stubs or client code for specific file or all diffed files
program
  .command('generate')
  .option('-c, --config <string>', 'Config file to use for generation')
  .action(generateFiles)

// Publish specific file, all diffed files (default) or all files
program
  .command('publish')
  .option('-d, --diff', 'Run publish on all changed yml files', true)
  .option('-i, --inputSpec <string>', 'Single spec file to publish')
  .option('-a, --all', 'publish all specs', false)
  .option('-p, --platform <string>', 'Platform to publish to', 'jfrog')
  .action(publish)

program.parse(process.argv)
