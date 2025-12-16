# Database Schema (MongoDB)

## Survey Response Document Structure

```javascript
// Collection: responses
{
  _id: ObjectId("..."),
  
  // Metadata
  submittedAt: ISODate("2024-12-16T10:30:00Z"),
  ipAddress: "192.168.1.100", // Anonymized for privacy
  sessionId: "uuid-v4-string",
  
  // Demographic Information (የተሳታፊዎች አጠቃላይ መረጃ)
  demographics: {
    gender: "male" | "female", // ፆታ: ወንድ | ሴት
    age: "18-30" | "31-40" | "41-50" | "50+", // ዕድሜ
    maritalStatus: "married" | "single" | "divorced" | "widowed", // የጋብቻ ሁኔታ
    educationLevel: "unfilled" | "1-8" | "9-12" | "certificate" | "diploma" | "first_degree" | "second_degree_plus" // የትምህርት ደረጃ
  },
  
  // Satisfaction Responses (5-point Likert Scale: 1-5)
  responses: {
    // Tangibility Questions
    tangibility: {
      q1_facilities: 4, // Modern facilities and equipment
      q2_appearance: 3, // Staff appearance and professionalism
      q3_materials: 5  // Quality of informational materials
    },
    
    // Responsiveness Questions (ፈጣን አገልግሎት ማግኘቶን)
    responsiveness: {
      q4_prompt_service: 3, // Prompt service delivery
      q5_willingness: 4,    // Staff willingness to help
      q6_quick_response: 2  // Quick response to requests
    },
    
    // Reliability Questions (ተዓማኒነት)
    reliability: {
      q7_promised_time: 4,  // Service delivered at promised time
      q8_problem_solving: 3, // Effective problem solving
      q9_dependable: 5      // Dependable service
    },
    
    // Assurance Questions (የሰራተኞች ብቃትና ስነምግባር)
    assurance: {
      q10_competence: 4,    // Staff competence and knowledge
      q11_courtesy: 5,      // Staff courtesy and respect
      q12_confidence: 3     // Confidence in service quality
    },
    
    // Empathy Questions
    empathy: {
      q13_individual_attention: 2, // Individual attention to customers
      q14_understanding: 4,        // Understanding customer needs
      q15_best_interests: 3        // Acting in customer's best interests
    }
  },
  
  // Computed Fields (calculated on insert/update)
  computed: {
    overallScore: 3.4,           // Average of all responses
    dimensionScores: {
      tangibility: 4.0,
      responsiveness: 3.0,
      reliability: 4.0,
      assurance: 4.0,
      empathy: 3.0
    },
    completionRate: 0.95         // Percentage of questions answered
  }
}
```

## Questions Metadata Collection

```javascript
// Collection: questions
{
  _id: ObjectId("..."),
  questionId: "q1_facilities",
  dimension: "tangibility",
  textAmharic: "ቢሮው ዘመናዊ መሳሪያዎችና ቴክኖሎጂ አለው",
  textEnglish: "The office has modern equipment and technology",
  order: 1,
  isActive: true,
  createdAt: ISODate("2024-12-16T00:00:00Z")
}
```

## Pre-computed Analytics Collection

```javascript
// Collection: analytics (for performance optimization)
{
  _id: ObjectId("..."),
  type: "daily_summary",
  date: ISODate("2024-12-16T00:00:00Z"),
  
  totalResponses: 150,
  overallCSAT: 3.6,
  
  demographicBreakdown: {
    gender: { male: 85, female: 65 },
    age: { "18-30": 45, "31-40": 60, "41-50": 30, "50+": 15 },
    education: { 
      diploma: 70, 
      first_degree: 45, 
      "9-12": 25, 
      certificate: 10 
    }
  },
  
  dimensionAverages: {
    tangibility: 3.8,
    responsiveness: 3.2,
    reliability: 3.9,
    assurance: 3.7,
    empathy: 3.4
  },
  
  topQuestions: [
    { questionId: "q9_dependable", score: 4.2 },
    { questionId: "q11_courtesy", score: 4.1 },
    { questionId: "q1_facilities", score: 4.0 }
  ],
  
  bottomQuestions: [
    { questionId: "q6_quick_response", score: 2.8 },
    { questionId: "q13_individual_attention", score: 2.9 },
    { questionId: "q14_understanding", score: 3.1 }
  ]
}
```

## Database Indexes

```javascript
// Compound indexes for efficient querying
db.responses.createIndex({ "demographics.gender": 1, "demographics.age": 1 })
db.responses.createIndex({ "demographics.educationLevel": 1, "submittedAt": -1 })
db.responses.createIndex({ "computed.overallScore": -1 })
db.responses.createIndex({ "submittedAt": -1 })

// Text search index for questions
db.questions.createIndex({ 
  "textAmharic": "text", 
  "textEnglish": "text" 
})
```