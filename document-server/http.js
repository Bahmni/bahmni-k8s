function requestedDocument(r) {
  let decodedPath = decodeURI(r.args['requested_document'])
  r.headersOut['x-requested-documents'] = decodedPath
  return decodedPath
}

async function authWithFetch(r) {
  r.headersOut[
    'x-api-url'
  ] = `http://${r.headersIn.host}/openmrs/ws/rest/v1/session`

  let response = await ngx.fetch(
    `http://openmrs.default.svc.cluster.local:8080/openmrs/ws/rest/v1/session`,
  )

  r.status = 200
  r.headersOut['Content-Type'] = 'text/plain; charset=utf-8'
  r.headersOut['x-session-response'] = response
  r.sendHeader()
  r.send(response)

  r.finish()
}

function auth(request) {
  request.subrequest('/openmrs/session', {method: 'GET'}, function (res) {
    request.error(`status from openmrs/session ${res.status}`)
    if (res.status === 200) {
      var jsonData = JSON.parse(res.responseBody)
      request.error(`response from openmrs/session ${jsonData}`)

      if (jsonData.authenticated) {
        request.status = 200
        request.headersOut['Content-Type'] = 'text/plain; charset=utf-8'
        request.headersOut['x-session'] = jsonData.sessionId
        request.sendHeader()
        request.send(`Access granted`)
        request.finish()
      }
    } else request.return(res.status, res.body)
  })
}

function foo(r) {
  r.log('hello from foo() handler')
  return 'foo'
}

function summary(r) {
  var a, s, h

  s = 'JS summary\n\n'

  s += 'Method: ' + r.method + '\n'
  s += 'HTTP version: ' + r.httpVersion + '\n'
  s += 'Host: ' + r.headersIn.host + '\n'
  s += 'Remote Address: ' + r.remoteAddress + '\n'
  s += 'URI: ' + r.uri + '\n'

  s += 'Headers:\n'
  for (h in r.headersIn) {
    s += "  header '" + h + "' is '" + r.headersIn[h] + "'\n"
  }

  s += 'Args:\n'
  for (a in r.args) {
    s += "  arg '" + a + "' is '" + r.args[a] + "'\n"
  }

  r.status = 200
  r.headersOut['Content-Type'] = 'text/plain; charset=utf-8'
  r.sendHeader()
  r.send(s)

  r.finish()
}

// since 0.7.0
async function fetch(r) {
  let results = await Promise.all([
    ngx.fetch('https://nginx.org/'),
    ngx.fetch('https://nginx.org/en/'),
  ])

  r.return(200, JSON.stringify(results, undefined, 4))
}

// since 0.7.0
async function hash(r) {
  let hash = await crypto.subtle.digest('SHA-512', r.headersIn.host)
  r.setReturnValue(Buffer.from(hash).toString('hex'))
}

export default {
  foo,
  summary,
  fetch,
  hash,
  requestedDocument,
  auth,
  authWithFetch,
}
