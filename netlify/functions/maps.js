const https = require('https');

exports.handler = async function(event) {
  const params = event.queryStringParameters;
  const { origins, destinations, mode } = params;
  const KEY = 'AIzaSyDuYgGbbYy0U23ZJVdp4Q4BU-LHXDmyxNs';

  let url;
  if (mode === 'directions') {
    // Single origin → single destination, real road route
    url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origins)}&destination=${encodeURIComponent(destinations)}&units=imperial&key=${KEY}`;
  } else {
    // Distance Matrix: one origin → multiple destinations
    url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(destinations)}&units=imperial&key=${KEY}`;
  }

  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: data
        });
      });
    }).on('error', (e) => {
      resolve({ statusCode: 500, body: JSON.stringify({ error: e.message }) });
    });
  });
};
