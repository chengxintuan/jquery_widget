const path = require('path')
const express = require('express')

const app = express()

app.use(express.static(path.join(__dirname, 'src')))

app.listen(8000)
console.log('server running port 8000!')
