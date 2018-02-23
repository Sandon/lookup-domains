/**
 * Created by Sandon on 2018/1/22.
 */
function increase (str) {
  let arr = str.split("")
  const len = arr.length
  if (!len) return 'a'
  
  let i
  for (i = len - 1; i !== -1; i--) {
    const code = arr[i].charCodeAt(0)
    if (code < 122) {
      arr[i] = String.fromCharCode(code + 1)
      break
    } else {
      arr[i] = "a"
    }
  }
  i === -1 && (arr.unshift("a"))
  return arr.join("")
}

module.exports = increase
