/* eslint-disable @typescript-eslint/no-var-requires */
import cp from 'child_process'
import chalk from 'chalk'
import * as glob from 'glob'

/** git用户名 */
function getUserInfo() {
  const { stdout, error } = cp.spawnSync('git', ['config', 'user.name'])
  if (error) {
    console.error(error)
    process.exit(1)
  }
  return `${stdout}`.replace(/\n/g, '')
}

/** git分支 */
function getBranch() {
  const { stdout, error } = cp.spawnSync('git', ['branch'])
  if (error) {
    console.error(error)
    process.exit(1)
  }
  // @ts-ignore
  const branchsArr = `${stdout}`.match().input.split('\n')
  const b = branchsArr.filter((item) => item.indexOf('*') !== -1)
  return b[0]?.replace(/\*|\s/g, '')
}

/** git diff */
function getDiff(file) {
  const { stdout, error } = cp.spawnSync('git', ['diff', 'HEAD', file])
  if (error) {
    console.error(error)
    process.exit(1)
  }

  return `${stdout}` && `${stdout}`.length
    ? `${stdout}`.match(/@@[\w\W]*$/)?.[0]
    : ''
}

/** 校验webhooks */
function checkWebHooks(webhooks) {
  const allValid = webhooks.every((item) => /^https:\/\/[/w/W]*/.test(item))

  return allValid
}

/** 校验email */
function checkEmial(email) {
  return /^\w+@[a-z0-9]+\.[a-z]{2,4}$/.test(email)
}

/** 处理glob的文件路径 */
function getGlobUrls(monitorFiles) {
  const hasGlob = monitorFiles.some((item) => item.includes('*'))
  if (!hasGlob) return monitorFiles
  let notGlobItems = monitorFiles.filter((item) => !item.includes('*'))
  const globItems = monitorFiles.filter((item) => item.includes('*'))
  for (let i = 0; i < globItems.length; i++) {
    const res = glob.sync(globItems[i], {
      cwd: process.cwd(),
    })
    if (res && res.length) notGlobItems = notGlobItems.concat(res)
  }

  return notGlobItems
}

/** 信息打印 */
const log = {
  success(info) {
    console.info(chalk.green(info))
  },
  fail(info) {
    console.error(chalk.red(info))
  },
  warining(info) {
    console.error(chalk.yellow(info))
  },
}

export {
  getUserInfo,
  getBranch,
  getDiff,
  checkWebHooks,
  checkEmial,
  getGlobUrls,
  log,
}
