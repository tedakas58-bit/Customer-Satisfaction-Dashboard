-- Query to check if all questions were inserted properly
SELECT 
    question_id,
    dimension,
    text_english,
    order_number,
    is_active
FROM questions 
ORDER BY order_number;

-- Count questions by dimension
SELECT 
    dimension,
    COUNT(*) as question_count
FROM questions 
GROUP BY dimension
ORDER BY dimension;

-- Total count
SELECT COUNT(*) as total_questions FROM questions;