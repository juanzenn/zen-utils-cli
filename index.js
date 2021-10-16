#! /usr/bin/env node
const chalk = require("chalk");
const { program } = require("commander");
const deleteEmptyFiles = require("./commands/deleteEmptyFiles");

program
  .command("delete-empty-files")
  .description("Delete empty files in the current project")
  .option("-f, --force", "Force the delete of the files", false)
  .action((opts) => deleteEmptyFiles(opts));

program.parse();
