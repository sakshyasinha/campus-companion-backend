// Test the Placement ML prediction endpoint
const BASE_URL = 'http://localhost:3000/api'

let authToken = ''

async function registerAndLogin() {
  try {
    console.log('\n=== Registering new user ===')
    const registerRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Placement Test User',
        email: `placement-test-${Date.now()}@example.com`,
        password: 'test123',
        role: 'student'
      })
    })
    
    if (!registerRes.ok) {
      console.error('Registration failed:', registerRes.status)
      return false
    }

    console.log('✓ User registered successfully')

    console.log('\n=== Logging in ===')
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `placement-test-${Date.now()}@example.com`,
        password: 'test123'
      })
    })

    if (!loginRes.ok) {
      console.error('Login failed:', loginRes.status)
      return false
    }

    const loginData = await loginRes.json()
    authToken = loginData.token
    console.log('✓ Login successful, token received')
    return true
  } catch (err) {
    console.error('Auth error:', err.message)
    return false
  }
}

async function testPlacementPrediction() {
  try {
    console.log('\n=== Testing Placement Prediction ===')
    
    const payload = {
      cgpa: 8.1,
      backlogs: 1,
      attendance: 82,
      technical_skills: {
        python: 1,
        java: 1,
        sql: 0,
        dsa: 1,
        dbms: 1,
        os: 0,
        ml_basics: 1
      },
      profile_strength: {
        projects_count: 3,
        internship: 1,
        hackathon: 0
      }
    }

    console.log('Request payload:', JSON.stringify(payload, null, 2))

    const response = await fetch(`${BASE_URL}/ml/predict-placement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    })

    const responseData = await response.json()
    
    console.log('\n✓ Response Status:', response.status)
    console.log('Response Data:', JSON.stringify(responseData, null, 2))

    if (response.ok) {
      console.log('\n✓ Placement prediction test PASSED')
      console.log(`Placement Probability: ${responseData.placement_probability}`)
      console.log(`Decision: ${responseData.decision}`)
      return true
    } else {
      console.log('\n✗ Placement prediction test FAILED')
      return false
    }
  } catch (err) {
    console.error('Test error:', err.message)
    return false
  }
}

async function runTests() {
  console.log('Starting Placement ML Tests...')
  
  if (await registerAndLogin()) {
    await testPlacementPrediction()
  } else {
    console.error('Failed to authenticate')
  }
}

runTests()
