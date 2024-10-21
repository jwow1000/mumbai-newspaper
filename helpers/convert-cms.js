import { fetchMojes } from "./fetch.js";


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

export function convertMojesToCSV() {
  console.log("fired?")
  fetchMojes().then( (data) => {
    console.log("wow data: ", data)
    // filter data in json format before csv convert
    // get rid of Mojes Worli
    const mapped = data.map((item) => {
      const descripDe = parseDescription( item.description );
      // parse the description html into seperate fields
      const newJson = {
        "name": parseName( item.title ),
        "marathi-title": descripDe.headlineTranslation,
        "tags": item.keywords,
        "date-published": item.date,
        "type": item.author,
        "publisher": item.publisher,
        "place": item.place,
        "language": item.language,
        "voices": descripDe.voices,
        "larger-questions": descripDe.largerQuestions,
        "body-text-english": item.translation,
        "body-text-marathi": item.content,
        "image-id": item.id
      }
      return newJson;
  
    })
  
    console.log("amppeed", mapped)
  
    
    // console.log("csvData", csvData)
    
    // Download the CSV file
    const csvData = convertToCSV( mapped );
    downloadCSV(csvData, 'mojes_data.csv');
  
  
  });
}

