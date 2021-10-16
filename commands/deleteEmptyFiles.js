const conf = new (require("conf"))()
const chalk = require("chalk")
const { exec } = require("child_process")
const log = require("../utils/log")
const readline = require("readline")

function deleteFiles() {
  exec(
    `find -type f -empty -not -path "./exclude/*" -not -path "./node_modules" -delete`
  )
}

function lookForEmptyFiles() {
  return new Promise((resolve, reject) => {
    exec(
      `find -type f -empty -not -path "./build/*" -not -path "./node_modules/*"`,
      (err, stdout) => {
        if (err) {
          reject(err)
        } else {
          resolve(stdout)
        }
      }
    )
  })
}

async function deleteEmptyFiles(opts) {
  const { force } = opts
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  log(chalk.white.bold(`\n🔍 Searching...`))

  const emptyFiles = await lookForEmptyFiles()

  if (!emptyFiles) {
    log(chalk.white.bold(`\n🛸 No empty files!`))
    rl.close()
    return
  }

  log(chalk.white.bold(`\n🧟 Your empty files:\n`))
  log(chalk.gray.italic(emptyFiles))

  if (force) {
    log(chalk.red.bold(`😰 You selected 'force' as an option`))
    log(chalk.red.bold(`I hope you know what you are doing.\n`))
    deleteFiles()
    log(chalk.green.bold(`✓ Files deleted`))
    rl.close()

    return
  }

  log(
    chalk.gray.bold("Are you sure you want to delete these files? ([Y]es/[N]o)")
  )

  rl.question(": ", async (res) => {
    if (new RegExp("^y", "i").test(res)) {
      log(chalk.yellow.bold(`\n⌛ Deleting empty files...`))
      deleteFiles()
      log(chalk.green.bold(`\n✓ Files deleted`))
      rl.close()
    } else {
      log(chalk.green.bold(`\n🛸 Good choice`))
      rl.close()
    }
  })

  return
}

module.exports = deleteEmptyFiles
