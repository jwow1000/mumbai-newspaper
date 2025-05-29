import { fetchMojes } from "./fetch.js";
// remove OCR text, and Automated
function cleanBodyText(htmlString) {
  if (!htmlString) return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  const body = doc.body;

  // Remove leading label (e.g., <b>Automated Translation:</b><br> or <b>OCR text:</b><br>)
  const firstBold = body.querySelector("b");
  if (firstBold && firstBold.nextSibling && firstBold.nextSibling.textContent.trim() === "") {
    firstBold.remove(); // remove the <b>
    const br = body.querySelector("br");
    if (br) br.remove(); // remove the <br> after <b>
  }

  // Return cleaned plain text version (optional: you could also keep HTML here if you want)
  return body.innerHTML;
}

// Function to convert JSON array to CSV format
function convertToCSV(data) {
  const csvRows = [];
  
  // Get all the keys (columns) for CSV from the first document
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(',')); // Add the headers row

  // Loop through each document and create a row of CSV data
  data.forEach(item => {
    const values = headers.map(header => {
      if( item[header] ) {
        let value = item[header] !== null ? item[header].toString() : ''; // Convert non-string values to string and handle nulls
        const escapedValue = value.replace(/"/g, '""');
        return `"${escapedValue}"`;  // Wrap each value in quotes

      }
    });
    csvRows.push(values.join(',')); // Add the row to CSV
  });

  return csvRows.join('\n');  // Join all rows with newline characters
}

// Function to create and download the CSV file
function downloadCSV(csvData, filename) {
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  a.click();
}

function downloadJSON(jsonData, filename) {
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  a.click();
}

function parseDescription(description) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(description, 'text/html');

  // Extract parts from the description
  const elements = doc.querySelectorAll('b');
  // const head = doc.querySelector('b:nth-child(1)');
  // const voice = doc.querySelector('b:nth-child(3)');
  // const large = doc.querySelector('b:nth-child(5)');
  console.log("the bs", elements)
  const returnObj = {}
  elements.forEach((item, idx) => {
    
    if( idx === 0 ) {
      returnObj.headlineTranslation = item.nextSibling ? item.nextSibling.textContent.trim() : "blank";
    } else if( idx === 1 ) {
      returnObj.voices = item.nextSibling ? item.nextSibling.textContent.trim() : "blank";
    } else if( idx === 2 ) {
      returnObj.largerQuestions = item.nextSibling ? item.nextSibling.textContent.trim() : "blank";
    }
  })

  return returnObj; 
}
  
function parseName( title ) {
  const prefix = "Mojes Worli: ";
  if( title.startsWith( prefix ) ) {
    return title.replace( prefix, "");
  }
  return title;
}

function extractHeadline(text) {
  // Define a regular expression to capture the text between "<b>OCR text:</b> <br>" and "<br><br>"
  const pattern = /<b>OCR text:<\/b>\s*<br>\s*(.*?)\s*<br><br>/s;

  // Use String.prototype.match to find the match
  const match = text.match(pattern);
  
  if (match) {
      // Get the matched group which is the headline and trim whitespace
      let headline = match[1].trim();

      // Replace any line breaks or multiple spaces with a single space
      headline = headline.replace(/(\r\n|\n|\r|\s\s+)/g, ' ');

      console.log("marathhi headline:", headline);
      return headline;
  }
  return null;
}
function array2string( str ) {
  return str ? str.join(", ") : "";
}

export function convertMojesToCSV() {
  console.log("fired?")
  fetchMojes().then( (data) => {
    // filter data in json format before csv convert
    // get rid of Mojes Worli
    const mapped = data.map((item, idx) => {
      const descripDe = parseDescription( item.description );
      
      // parse the description html into seperate fields
      const newJson = {
        // "name": parseName( item.title ),
        "_type": "newspaperItem",
        "_slug": `${item.date}-${idx}`,
        "name": `${descripDe.headlineTranslation?.slice(0, 200)}-import-01`,
        "englishTitle": descripDe.headlineTranslation,
        "marathiTitle": extractHeadline( item.content ),
        "keywords": array2string(item.keywords),
        "datePublished": item.date,
        "type": array2string(item.author),
        "publisher": item.publisher,
        "place": array2string(item.place),
        "language": array2string(item.language),
        "voices": descripDe.voices,
        "largerQuestions": descripDe.largerQuestions,
        "bodyTextEnglish": cleanBodyText(item.translation),
        "bodyTextMarathi": cleanBodyText(item.content),
        "imageId": item.id,
        "articleId": item.articleId
      }
      return newJson;
  
    })
  
    console.log("amppeed", mapped)
  
    
    // ✅ Download JSON file
    downloadJSON(mapped, 'mojes_data.json');

    // Download the CSV file
    const csvData = convertToCSV( mapped );
    downloadCSV(csvData, 'mojes_data.csv');
  
  
  });
}

