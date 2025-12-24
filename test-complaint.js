import fetch from 'node:http'

// Test the complaint ML API directly
async function testComplaintAPI() {
  console.log('=== Testing Complaint ML API ===\n')

  // First, test the ML API directly
  console.log('Testing external ML API...')
  try {
    const mlResponse = await fetch('https://complaint-ml-project-1.onrender.com/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'The hostel wifi is not working properly' })
    })
    
    const mlData = await mlResponse.json()
    console.log('ML API Response:', JSON.stringify(mlData, null, 2))
    
    // Now test our backend endpoint
    console.log('\n\nTesting Backend Endpoint...')
    console.log('Make sure server is running on port 3000\n')
    
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Mzc5NGFkYTg5OWU3OWFmYzQwYmVlYyIsInJvbGUiOiJzdHVkZW50IiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTc2NjQyNTk1OCwiZXhwIjoxNzY3MDMwNzU4fQ.p2LsPe0MVW8u_3hRGyJQneWE-8rxNWwJEBijmFNx9ak'
    
    const backendResponse = await fetch('http://localhost:3000/api/ml/predict-complaint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ complaint_text: 'The hostel wifi is not working properly' })
    })
    
    const backendData = await backendResponse.json()
    console.log('Backend Response:', JSON.stringify(backendData, null, 2))
    
  } catch (err) {
    console.error('Error:', err.message)
  }
}

testComplaintAPI()
