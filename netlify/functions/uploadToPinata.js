const fetch = require('node-fetch');
const FormData = require('form-data');

exports.handler = async function(event, context) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { file, fileName, json, metadata } = JSON.parse(event.body);

    // Get Pinata JWT from environment variables
    const PINATA_JWT = process.env.PINATA_JWT;

    if (!PINATA_JWT) {
      console.error('PINATA_JWT not configured in environment variables');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'IPFS service not configured. Please set PINATA_JWT environment variable.' 
        }),
      };
    }

    let response;

    if (json) {
      // Upload JSON data
      const jsonData = {
        pinataContent: json,
        pinataMetadata: metadata || {
          name: `soulcred-metadata-${Date.now()}`,
          keyvalues: {
            type: 'metadata',
            uploadedAt: new Date().toISOString(),
          }
        }
      };

      response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });
    } else if (file && fileName) {
      // Upload file
      const buffer = Buffer.from(file, 'base64');
      const formData = new FormData();
      
      formData.append('file', buffer, fileName);
      
      if (metadata) {
        formData.append('pinataMetadata', JSON.stringify(metadata));
      }

      response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`,
          ...formData.getHeaders(),
        },
        body: formData,
      });
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Either file or json data is required' }),
      };
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pinata API error:', response.status, errorText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: `Pinata API error: ${response.status} ${response.statusText}`,
          details: errorText
        }),
      };
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
    };
  }
};