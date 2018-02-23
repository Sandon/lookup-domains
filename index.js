/**
 * Created by Sandon on 2018/1/22.
 */
const increase = require('./letters-increase-v2')
const request = require('request-promise-native')
const util = require('util')
const fs = require('fs')
const childProcess = require('child_process')

const exec = util.promisify(childProcess.exec)
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const appendFile = util.promisify(fs.appendFile)

/*
function requestTen (domainName) {
  let arr = []
  for (let i = 0; i !== 10; i++) {
    domainName = increase(domainName)
    arr.push(request(`http://${domainName}.com`).then(() => {
      console.log(`${domainName} done`)
    }).catch((e) => {
      console.log(`${domainName}: ${e}`)
    }))
  }
  return {
    domainName,
    promise: Promise.all(arr)
  }
}
async function check (domainName) {
  for (let i = 0; i !== 10 ; i++) {
    try {
      let res = await requestTen(domainName)
      domainName = res.domainName
    } catch (e) {
      console.log(e)
    }
  }
}
*/

async function checkOneByOne () {
  let domainName = await readFile('./now', 'utf-8')
  for (let i = 0; i !== 10000; i++) {
    let res
    try {
      res = await lookUp(`whois ${domainName}.com`)
    } catch (e) {
      console.log(`look up ${domainName}.com failed: ${e}`)
    }
    if (!res) {
    } else if (!res.Registrar && !res.organisation) {
      // todo: available
      console.log('available now')
      appendFile('./available', `\n ${domainName}.com`, 'utf-8')
      break
    } else if (res['Registry Expiry Date'] && res['Registry Expiry Date'] < '2018-06-01') {
      // todo: available in future
      console.log(`${domainName}.com available at ${res['Registry Expiry Date']}`)
      appendFile('./future', `\n ${domainName}.com ${res['Registry Expiry Date']}`, 'utf-8')
    } else {
      console.log(`${domainName}.com not available`)
    }
    domainName = increase(domainName)
    await writeFile('./now', domainName, 'utf-8')
  }
}
checkOneByOne()

/**
 * execute the look up command, and return parsed data
 * @param cmd
 * @returns {Promise}
 */
function lookUp (cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, function(err, data) {
      if (err) {
        reject(err)
      } else {
        let parsedData = {}
        data = data.split('\n')
        data.forEach((item, ind) => {
          if (ind < 3) return
          const index = item.indexOf(":")
          if (index !== -1) {
            parsedData[item.slice(0, index).trim()] = item.slice(index + 1).trim()
          }
        })
        resolve(parsedData)
      }
    })
  })
}
