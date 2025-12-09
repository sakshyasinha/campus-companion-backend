export async function predictAttendanceRisk (req, res) {
  try {
    const { overall_att, last7, last30, streak, trend } = req.body

    // Validate required fields
    if (
      overall_att === undefined ||
      last7 === undefined ||
      last30 === undefined ||
      streak === undefined ||
      trend === undefined
    ) {
      return res.status(400).json({ error: 'Missing required fields: overall_att, last7, last30, streak, trend' })
    }

    // Validate ranges
    if (
      overall_att < 0 || overall_att > 1 ||
      last7 < 0 || last7 > 1 ||
      last30 < 0 || last30 > 1
    ) {
      return res.status(400).json({ error: 'Attendance values must be between 0.0 and 1.0' })
    }

    // Call ML model API
    const mlApiUrl = process.env.ML_API_URL || 'https://attendance-ml-api-4.onrender.com'
    const mlEndpoint = `${mlApiUrl}/predict-attendance`
    
    console.log('Calling ML API:', mlEndpoint)
    const mlResponse = await fetch(mlEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ overall_att, last7, last30, streak, trend })
    })

    console.log('ML API response status:', mlResponse.status)

    if (!mlResponse.ok) {
      const errorText = await mlResponse.text()
      console.error('ML API error:', mlResponse.status, errorText)
      return res.status(503).json({ error: 'ML service unavailable', status: mlResponse.status })
    }

    const prediction = await mlResponse.json()
    console.log('ML prediction:', prediction)

    // Ensure response matches expected format
    return res.json({
      risk_class: prediction.risk_class,
      risk_label: prediction.risk_label,
      probability: prediction.probability
    })
  } catch (err) {
    console.error('Prediction error:', err)
    return res.status(500).json({ error: 'Server error', details: err.message })
  }
}
