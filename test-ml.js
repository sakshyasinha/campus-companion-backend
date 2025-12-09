import fetch from 'node:http'

const registerUser = () => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'test123',
      role: 'student'
    })

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }

    const req = fetch.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => { body += chunk })
      res.on('end', () => {
        console.log('Register response:', body)
        try {
          resolve(JSON.parse(body))
        } catch (e) {
          reject(e)
        }
      })
    })

    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

const login = () => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      email: 'testuser@example.com',
      password: 'test123'
    })

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }

    const req = fetch.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => { body += chunk })
      res.on('end', () => {
        console.log('Login response:', body)
        try {
          resolve(JSON.parse(body))
        } catch (e) {
          reject(e)
        }
      })
    })

    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

const testAttendanceRisk = (token, testCase) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(testCase.data)

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/ml/attendance-risk',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        Authorization: `Bearer ${token}`
      }
    }

    const req = fetch.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => { body += chunk })
      res.on('end', () => {
        console.log(`\n${testCase.name}:`)
        console.log('Input:', JSON.stringify(testCase.data, null, 2))
        console.log('Response:', body)
        console.log('Status:', res.statusCode)
        resolve()
      })
    })

    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

async function runTests () {
  try {
    console.log('=== Testing ML Attendance Risk Prediction ===\n')

    // Register or login
    let token
    try {
      await registerUser()
    } catch (e) {
      console.log('User might already exist, trying login...')
    }

    const loginRes = await login()
    token = loginRes.token

    // Test cases
    const testCases = [
      {
        name: 'Test 1: Safe Student',
        data: {
          overall_att: 0.85,
          last7: 0.80,
          last30: 0.82,
          streak: 0,
          trend: 0.05
        }
      },
      {
        name: 'Test 2: At Risk Student (from example)',
        data: {
          overall_att: 0.70,
          last7: 0.55,
          last30: 0.60,
          streak: 1,
          trend: -0.05
        }
      },
      {
        name: 'Test 3: High Risk Student',
        data: {
          overall_att: 0.65,
          last7: 0.50,
          last30: 0.55,
          streak: 3,
          trend: -0.10
        }
      },
      {
        name: 'Test 4: Missing Field (should error)',
        data: {
          overall_att: 0.70,
          last7: 0.55
          // missing last30, streak, trend
        }
      },
      {
        name: 'Test 5: Invalid Range (should error)',
        data: {
          overall_att: 1.5,
          last7: 0.55,
          last30: 0.60,
          streak: 1,
          trend: -0.05
        }
      }
    ]

    for (const testCase of testCases) {
      await testAttendanceRisk(token, testCase)
    }

    console.log('\n=== Tests Complete ===')
    process.exit(0)
  } catch (error) {
    console.error('Test error:', error)
    process.exit(1)
  }
}

runTests()
