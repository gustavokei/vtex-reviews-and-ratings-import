const fs = require('fs');
const csv = require('csv-parser');
const https = require('https');
require('dotenv').config();

// Load environment variables from .env file
const accountName = process.env.accountName;
const VTEX_API_APPKEY = process.env.VTEX_API_APPKEY;
const VTEX_API_APPTOKEN = process.env.VTEX_API_APPTOKEN;

if (!accountName || !VTEX_API_APPKEY || !VTEX_API_APPTOKEN) {
  console.error('Missing accountName, VTEX_API_APPKEY, or VTEX_API_APPTOKEN in .env file');
  process.exit(1);
}

// Get CSV file path from command line arguments
const csvFilePath = process.argv[2];

if (!csvFilePath) {
  console.error('Please provide the path to the CSV file.');
  process.exit(1);
}

// Read and parse the CSV file
const reviews = [];
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    reviews.push({
      productId: row['Product ID'],
      rating: parseInt(row.Rating, 10),
      title: row.Title || '',
      text: row.Review || '',
      reviewerName: row.Reviewer,
      approved: row.Approved.toUpperCase() === 'TRUE'
    });
  })
  .on('end', () => {
    const options = {
      method: 'POST',
      hostname: `${accountName}.myvtex.com`,
      port: null,
      path: '/reviews-and-ratings/api/reviews',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VTEX-API-AppKey': VTEX_API_APPKEY,
        'X-VTEX-API-AppToken': VTEX_API_APPTOKEN
      }
    };

    const req = https.request(options, (res) => {
      const chunks = [];

      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const body = Buffer.concat(chunks);
        console.log('CSV file successfully processed');
        console.log(body.toString());
      });
    });

    req.on('error', (e) => {
      console.error(`Problem with request: ${e.message}`);
    });

    req.write(JSON.stringify(reviews));
    req.end();
  });
