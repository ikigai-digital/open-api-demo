import { middleware } from 'express-openapi-validator'
import path from 'path'
import express from 'express'
import http from 'http'

const app = express()

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: false }))

const port = 3000
const apiSpecV1 = path.join(__dirname, './generated/provider/nrs/nrsApi/1.0.3/api', 'openapi.yaml')
const apiSpecV2 = path.join(__dirname, './generated/provider/nrs/nrsApi/2.0.0/api', 'openapi.yaml')
const operationHandlers = path.join(__dirname)

// V1 stub
app.use(
  middleware({
    apiSpec: apiSpecV1,
    operationHandlers,
    validateRequests: true,
    validateResponses: true,
  }),
)

// V2 stub
app.use(
  middleware({
    apiSpec: apiSpecV2,
    operationHandlers,
    validateRequests: true,
    validateResponses: true,
  }),
)

app.use((err, req, res, next) => {
  // format errors
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  })
})

http.createServer(app).listen(port)
console.log(`Listening on port ${port}`)
