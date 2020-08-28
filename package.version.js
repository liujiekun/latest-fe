const fs = require('fs')
const branch = process.argv[2]
const now = new Date()
const p0 = num => (num + '').padStart(2, '0')
const currentTime = `${now.getFullYear()}-${p0(now.getMonth() + 1)}-${p0(now.getDate())} ${p0(now.getHours())}:${p0(now.getMinutes())}:${p0(now.getSeconds())}`
const content = fs.readFileSync('./index.html', 'utf8')
const newContent = content.replace(/____####[\s\S]*####____/, `____####发布时间：${currentTime}，发布分支：${branch}####____`)
fs.writeFileSync('./index.html', newContent, 'utf8')
