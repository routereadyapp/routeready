const https = require('https');

exports.handler = async function(event) {
  const params = event.queryStringParameters;
  const { origin, destination, waypoints, mode } = params;
  const KEY = process.env.GOOGLE_MAPS_KEY;

  let url;

  if (mode === 'optimize') {
    const waypointStr = waypoints.split('|').map(w => encodeURIComponent(w)).join('|');
    url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&waypoints=optimize:true|${waypointStr}&units=imperial&key=${KEY}`;
  } else if (mode === 'directions') {
    url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&units=imperial&key=${KEY}`;
 } else {
    const orig = params.origins || origin || '';
    const dest = params.waypoints || waypoints || '';
    url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(orig)}&destinations=${encodeURIComponent(dest)}&units=imperial&key=${KEY}`;
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
