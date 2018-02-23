/**
 * Created by Sandon on 2018/1/22.
 */
// 97-122
// 1-26
function increase (str) {
  const len = str.length
  if (!len) return 'a'
  
  // to array whose item is ASCII of the origin char minus 97
  let arr = []
  for (let i = 0; i !== len; i++) {
    arr.push(str.charCodeAt(i) - 96)
  }
  // to decimal
  let sum = 0
  const lastIndex = len - 1
  for (let i = lastIndex; i !== -1; i--) {
    sum += power(arr[i], 27, lastIndex - i)
  }
  
  // increased num
  sum ++
  // to array which is 27 based number
  let newArr = []
  let tmp
  while (sum) {
    newArr.push(sum % 27)
    sum = Math.floor(sum / 27)
  }
  newArr.reverse()
  
  // to new string
  let newStr = newArr.map(item => String.fromCharCode(item + 96)).join('')
  return newStr.replace(/`/g, 'a')
}

function power (coefficient, base, power) {
  let sum = coefficient
  for (let i = 0; i !== power; i++) {
    sum *= base
  }
  return sum
}
console.log(increase("azzz"))
