const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { file, fileName } = JSON.parse(event.body);

  // Tu JWT debe estar en las variables de entorno de Netlify
  const PINATA_JWT = process.env.PINATA_JWT;

  if (!PINATA_JWT) {
    return { statusCode: 500, body: 'Pinata JWT not configured' };
  }

  // Decodifica el archivo base64
  const buffer = Buffer.from(file, 'base64');

  const formData = new FormData();
  formData.append('file', buffer, fileName);

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: formData,
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};