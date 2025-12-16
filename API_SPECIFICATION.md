# REST API Specification

## Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://csat-api.render.com/api`

## Authentication
Currently using IP-based rate limiting. Future versions may implement API key authentication.

## Content Type
All requests and responses use `application/json` unless specified otherwise.

## Error Response Format
```json
{
  "error": true,
  "message": "Error description",
  "code": "ERROR_CODE",
  "timestamp": "2024-12-16T10:30:00Z"
}
```

## API Endpoints

### 1. POST /api/responses
**Purpose**: Ingest a new survey response

**Request Body**:
```json
{
  "demographics": {
    "gender": "male",
    "age": "31-40",
    "maritalStatus": "married",
    "educationLevel": "diploma"
  },
  "responses": {
    "tangibility": {
      "q1_facilities": 4,
      "q2_appearance": 3,
      "q3_materials": 5
    },
    "responsiveness": {
      "q4_prompt_service": 3,
      "q5_willingness": 4,
      "q6_quick_response": 2
    },
    "reliability": {
      "q7_promised_time": 4,
      "q8_problem_solving": 3,
      "q9_dependable": 5
    },
    "assurance": {
      "q10_competence": 4,
      "q11_courtesy": 5,
      "q12_confidence": 3
    },
    "empathy": {
      "q13_individual_attention": 2,
      "q14_understanding": 4,
      "q15_best_interests": 3
    }
  }
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "responseId": "507f1f77bcf86cd799439011",
  "overallScore": 3.4,
  "message": "Survey response recorded successfully"
}
```

**Validation Rules**:
- All demographic fields are required
- Response values must be integers 1-5
- At least 80% of questions must be answered

---

### 2. GET /api/data/overall_summary
**Purpose**: Get overall CSAT metrics and demographic counts

**Response** (200 OK):
```json
{
  "totalResponses": 1247,
  "overallCSAT": 3.6,
  "responseRate": 0.89,
  "lastUpdated": "2024-12-16T10:30:00Z",
  "demographicCounts": {
    "gender": {
      "male": 687,
      "female": 560
    },
    "age": {
      "18-30": 312,
      "31-40": 498,
      "41-50": 287,
      "50+": 150
    },
    "educationLevel": {
      "unfilled": 45,
      "1-8": 123,
      "9-12": 234,
      "certificate": 189,
      "diploma": 356,
      "first_degree": 245,
      "second_degree_plus": 55
    },
    "maritalStatus": {
      "married": 789,
      "single": 298,
      "divorced": 98,
      "widowed": 62
    }
  },
  "trends": {
    "weeklyChange": 0.12,
    "monthlyChange": 0.08
  }
}
```

---

### 3. GET /api/data/dimension_scores
**Purpose**: Get average scores for each service quality dimension

**Response** (200 OK):
```json
{
  "dimensions": {
    "tangibility": {
      "score": 3.8,
      "responseCount": 1247,
      "questions": [
        {
          "questionId": "q1_facilities",
          "score": 4.1,
          "textAmharic": "ቢሮው ዘመናዊ መሳሪያዎችና ቴክኖሎጂ አለው",
          "textEnglish": "The office has modern equipment and technology"
        },
        {
          "questionId": "q2_appearance",
          "score": 3.7,
          "textAmharic": "ሰራተኞች ተገቢ ልብስ ለብሰው ይገኛሉ",
          "textEnglish": "Staff are appropriately dressed and professional"
        },
        {
          "questionId": "q3_materials",
          "score": 3.6,
          "textAmharic": "የመረጃ ቁሳቁሶች ግልጽና ተደራሽ ናቸው",
          "textEnglish": "Informational materials are clear and accessible"
        }
      ]
    },
    "responsiveness": {
      "score": 3.2,
      "responseCount": 1247,
      "questions": [...]
    },
    "reliability": {
      "score": 3.9,
      "responseCount": 1247,
      "questions": [...]
    },
    "assurance": {
      "score": 3.7,
      "responseCount": 1247,
      "questions": [...]
    },
    "empathy": {
      "score": 3.4,
      "responseCount": 1247,
      "questions": [...]
    }
  },
  "lastUpdated": "2024-12-16T10:30:00Z"
}
```

---

### 4. GET /api/data/question_performance
**Purpose**: Get performance analysis for individual questions

**Query Parameters**:
- `sort`: `asc` or `desc` (default: `desc`)
- `limit`: Number of results (default: all)

**Response** (200 OK):
```json
{
  "questions": [
    {
      "questionId": "q9_dependable",
      "dimension": "reliability",
      "score": 4.2,
      "responseCount": 1247,
      "textAmharic": "አገልግሎቱ ተዓማኒ ነው",
      "textEnglish": "The service is dependable",
      "rank": 1
    },
    {
      "questionId": "q11_courtesy",
      "dimension": "assurance",
      "score": 4.1,
      "responseCount": 1247,
      "textAmharic": "ሰራተኞች ትሁትና አክባሪ ናቸው",
      "textEnglish": "Staff are courteous and respectful",
      "rank": 2
    }
  ],
  "topPerformers": [
    "q9_dependable",
    "q11_courtesy",
    "q1_facilities"
  ],
  "bottomPerformers": [
    "q6_quick_response",
    "q13_individual_attention",
    "q14_understanding"
  ],
  "lastUpdated": "2024-12-16T10:30:00Z"
}
```

---

### 5. GET /api/data/filtered_analysis
**Purpose**: Get filtered analysis based on demographic criteria

**Query Parameters**:
- `gender`: `male` | `female`
- `age`: `18-30` | `31-40` | `41-50` | `50+`
- `educationLevel`: `unfilled` | `1-8` | `9-12` | `certificate` | `diploma` | `first_degree` | `second_degree_plus`
- `maritalStatus`: `married` | `single` | `divorced` | `widowed`
- `dateFrom`: ISO date string (optional)
- `dateTo`: ISO date string (optional)

**Example Request**:
```
GET /api/data/filtered_analysis?gender=female&educationLevel=diploma&age=31-40
```

**Response** (200 OK):
```json
{
  "filters": {
    "gender": "female",
    "educationLevel": "diploma",
    "age": "31-40"
  },
  "matchingResponses": 89,
  "overallCSAT": 3.8,
  "dimensionScores": {
    "tangibility": 4.0,
    "responsiveness": 3.4,
    "reliability": 4.1,
    "assurance": 3.9,
    "empathy": 3.6
  },
  "topQuestions": [
    {
      "questionId": "q9_dependable",
      "score": 4.3,
      "dimension": "reliability"
    }
  ],
  "bottomQuestions": [
    {
      "questionId": "q6_quick_response",
      "score": 2.9,
      "dimension": "responsiveness"
    }
  ],
  "demographicBreakdown": {
    "totalInCategory": 89,
    "percentageOfTotal": 7.1
  },
  "lastUpdated": "2024-12-16T10:30:00Z"
}
```

---

## Additional Endpoints

### 6. GET /api/questions
**Purpose**: Get all question metadata

**Response** (200 OK):
```json
{
  "questions": [
    {
      "questionId": "q1_facilities",
      "dimension": "tangibility",
      "textAmharic": "ቢሮው ዘመናዊ መሳሪያዎችና ቴክኖሎጂ አለው",
      "textEnglish": "The office has modern equipment and technology",
      "order": 1,
      "isActive": true
    }
  ]
}
```

### 7. GET /api/export/csv
**Purpose**: Export data as CSV file

**Query Parameters**: Same as filtered_analysis endpoint

**Response**: CSV file download

### 8. GET /api/health
**Purpose**: Health check endpoint

**Response** (200 OK):
```json
{
  "status": "healthy",
  "timestamp": "2024-12-16T10:30:00Z",
  "database": "connected",
  "version": "1.0.0"
}
```

## Rate Limiting
- 100 requests per minute per IP for data endpoints
- 10 requests per minute per IP for POST endpoints
- 429 status code returned when limits exceeded

## Caching
- GET endpoints cached for 5 minutes
- Cache invalidated on new survey submissions
- ETags supported for conditional requests