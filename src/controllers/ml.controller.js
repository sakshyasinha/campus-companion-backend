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

export async function predictComplaint (req, res) {
  try {
    const { complaint_text } = req.body

    // Validate complaint text
    if (!complaint_text || typeof complaint_text !== 'string' || complaint_text.trim() === '') {
      return res.status(400).json({ 
        error: true, 
        message: 'Complaint text is empty or invalid' 
      })
    }

    // Call ML model API
    const mlApiUrl = process.env.COMPLAINT_ML_API_URL || 'https://complaint-ml-project-1.onrender.com'
    const mlEndpoint = `${mlApiUrl}/predict`
    
    console.log('Calling ML API:', mlEndpoint)
    const mlResponse = await fetch(mlEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: complaint_text })
    })

    console.log('ML API response status:', mlResponse.status)

    if (!mlResponse.ok) {
      const errorText = await mlResponse.text()
      console.error('ML API error:', mlResponse.status, errorText)
      return res.status(503).json({ 
        error: true, 
        message: 'ML service unavailable' 
      })
    }

    const prediction = await mlResponse.json()
    console.log('ML prediction:', prediction)

    // Transform the ML API response to our format
    const confidence = prediction.max_probability || 0
    const predicted_category = prediction.prediction || 'general'
    const top_labels = prediction.top_labels || []
    const recommendations = prediction.recommendations || []

    // Check if confidence is low (less than 0.4)
    if (confidence < 0.4) {
      return res.json({
        predicted_category: 'general',
        confidence: confidence,
        message: 'Low confidence prediction, manual review recommended'
      })
    }

    // Return standard response
    return res.json({
      predicted_category: predicted_category,
      confidence: confidence,
      top_labels: top_labels,
      recommendations: recommendations
    })
  } catch (err) {
    console.error('Complaint prediction error:', err)
    return res.status(500).json({ 
      error: true, 
      message: 'Server error: ' + err.message 
    })
  }
}

export async function predictPlacement (req, res) {
  try {
    const { cgpa, backlogs, attendance, technical_skills, profile_strength } = req.body

    // Validate required fields
    if (
      cgpa === undefined ||
      backlogs === undefined ||
      attendance === undefined ||
      !technical_skills ||
      !profile_strength
    ) {
      return res.status(400).json({ 
        error: 'Missing required fields: cgpa, backlogs, attendance, technical_skills, profile_strength' 
      })
    }

    // Validate ranges
    if (cgpa < 0 || cgpa > 10 || attendance < 0 || attendance > 100) {
      return res.status(400).json({ 
        error: 'CGPA must be between 0-10 and attendance between 0-100' 
      })
    }

    // Call ML model API
    const mlApiUrl = process.env.PLACEMENT_ML_API_URL || 'https://placement-ml-app.onrender.com'
    const mlEndpoint = `${mlApiUrl}/api/v1/placement/predict`
    
    console.log('Calling Placement ML API:', mlEndpoint)
    
    try {
      const mlResponse = await fetch(mlEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cgpa, backlogs, attendance, technical_skills, profile_strength })
      })

      console.log('Placement ML API response status:', mlResponse.status)

      if (mlResponse.ok) {
        const prediction = await mlResponse.json()
        console.log('Placement prediction:', prediction)
        return res.json({
          placement_probability: prediction.placement_probability,
          decision: prediction.decision,
          timestamp: new Date().toISOString()
        })
      } else {
        const errorText = await mlResponse.text()
        console.error('Placement ML API error:', mlResponse.status, errorText)
        // Fallback: compute local prediction based on heuristics
        return computeLocalPlacement(cgpa, backlogs, attendance, technical_skills, profile_strength, res)
      }
    } catch (fetchErr) {
      console.error('ML API fetch error:', fetchErr.message)
      // Fallback to local computation if API is unavailable
      return computeLocalPlacement(cgpa, backlogs, attendance, technical_skills, profile_strength, res)
    }
  } catch (err) {
    console.error('Placement prediction error:', err)
    return res.status(500).json({ 
      error: 'Server error', 
      details: err.message 
    })
  }
}

// Local heuristic-based placement prediction
function computeLocalPlacement (cgpa, backlogs, attendance, technical_skills, profile_strength, res) {
  try {
    // Calculate scores
    const cgpaScore = (cgpa / 10) * 30  // 30 points max
    const backlogPenalty = backlogs * 5  // -5 per backlog
    const attendanceScore = (attendance / 100) * 20  // 20 points max
    
    // Count technical skills
    const skillCount = Object.values(technical_skills).reduce((a, b) => a + b, 0)
    const skillScore = (skillCount / 7) * 20  // 20 points max
    
    // Profile strength
    const projectScore = Math.min(profile_strength.projects_count * 5, 15)  // max 15
    const internshipScore = profile_strength.internship * 10  // 10 points
    const hackathonScore = profile_strength.hackathon * 5  // 5 points
    
    // Total score
    let totalScore = cgpaScore + attendanceScore + skillScore + projectScore + internshipScore + hackathonScore
    totalScore = Math.max(0, totalScore - backlogPenalty)
    
    // Normalize to 0-1 probability
    const maxScore = 100
    const placementProbability = Math.min(totalScore / maxScore, 1.0)
    
    // Decision logic
    let decision = 'Low Chance'
    if (placementProbability >= 0.7) {
      decision = 'High Chance'
    } else if (placementProbability >= 0.4) {
      decision = 'Medium Chance'
    }
    
    return res.json({
      placement_probability: Math.round(placementProbability * 10000) / 10000,
      decision: decision,
      timestamp: new Date().toISOString(),
      source: 'local_heuristic'
    })
  } catch (err) {
    console.error('Local placement computation error:', err)
    return res.status(500).json({
      error: 'Prediction computation failed',
      details: err.message
    })
  }
}
