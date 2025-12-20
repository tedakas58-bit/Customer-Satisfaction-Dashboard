// Utility to test Amharic encoding
export const testAmharicEncoding = () => {
  const testStrings = [
    'የደንበኛ እርካታ ሪፖርት',
    'አጠቃላይ ማጠቃለያ',
    'ለሚ ኩራ ክፍለ ከተማ ሰላምና ፀጥታ አስተዳደር ጽ/ቤት',
    'ሰራተኞች ፈጣን አገልግሎት ይሰጣሉ',
    'የአገልግሎት ጥራት ልኬቶች'
  ];

  console.log('🧪 Testing Amharic encoding...');
  
  testStrings.forEach((text, index) => {
    const encoded = encodeURIComponent(text);
    const decoded = decodeURIComponent(encoded);
    const utf8Bytes = new TextEncoder().encode(text);
    
    console.log(`Test ${index + 1}:`);
    console.log(`Original: ${text}`);
    console.log(`Encoded: ${encoded}`);
    console.log(`Decoded: ${decoded}`);
    console.log(`UTF-8 bytes: ${utf8Bytes.length} bytes`);
    console.log(`Match: ${text === decoded ? '✅' : '❌'}`);
    console.log('---');
  });
};

// Test if browser supports Amharic properly
export const testBrowserAmharicSupport = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return false;
  
  ctx.font = '16px Arial';
  const testText = 'የደንበኛ እርካታ';
  const width1 = ctx.measureText(testText).width;
  
  ctx.font = '16px Nyala, Arial';
  const width2 = ctx.measureText(testText).width;
  
  // If widths are different, Amharic font is likely working
  return width1 !== width2;
};

// Create a test CSV with proper UTF-8 BOM
export const createTestAmharicCSV = () => {
  const testData = [
    ['የደንበኛ እርካታ ሪፖርት', 'Customer Satisfaction Report'],
    ['አጠቃላይ ማጠቃለያ', 'Executive Summary'],
    ['ሰራተኞች ፈጣን አገልግሎት ይሰጣሉ', 'Staff provide prompt service'],
    ['የአገልግሎት ጥራት ልኬቶች', 'Service Quality Dimensions']
  ];

  // Create CSV content with UTF-8 BOM
  const bom = '\uFEFF';
  let csvContent = bom;
  
  testData.forEach(row => {
    csvContent += row.join(',') + '\n';
  });

  // Create and download test file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'amharic-test.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log('✅ Test CSV with UTF-8 BOM created');
};