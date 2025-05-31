function colorStatus(status) {
  if (status >= 500) return `\x1b[31m${status}\x1b[0m`      
  if (status >= 400) return `\x1b[33m${status}\x1b[0m`      
  if (status >= 300) return `\x1b[36m${status}\x1b[0m`      
  if (status >= 200) return `\x1b[32m${status}\x1b[0m`      
  return status
}

function logger(req, res, next) {
  const start = Date.now()
  console.log(`[REQ] ${req.method} ${req.originalUrl}`)
  res.on('finish', () => {
    const ms = Date.now() - start
    console.log(`[RES] ${req.method} ${req.originalUrl} - status: ${colorStatus(res.statusCode)} (${ms}ms)`)
  })
  next()
}

module.exports = logger