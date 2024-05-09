const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { parse } = require('json2csv');
const { js2xml } = require('xml-js');

const TOR_EXIT_LIST_URL = 'https://check.torproject.org/exit-addresses';
const TOR_EXIT_LOCAL_PATH = path.join(__dirname, 'tor_exit_nodes.txt');

async function downloadTorExitNodeList() {
  try {
    const response = await axios.get(TOR_EXIT_LIST_URL);
    fs.writeFileSync(TOR_EXIT_LOCAL_PATH, response.data);
    console.log('Tor exit node list updated.');
  } catch (error) {
    console.error('Error fetching Tor exit node list:', error.message);
  }
}

function isTorExitNode(ip) {
  if (!fs.existsSync(TOR_EXIT_LOCAL_PATH)) {
    return false;
  }

  const exitNodes = fs.readFileSync(TOR_EXIT_LOCAL_PATH, 'utf-8');
  return exitNodes.includes(ip);
}

setInterval(downloadTorExitNodeList, 24 * 60 * 60 * 1000);
downloadTorExitNodeList();

function filterFields(data, requestedFields) {
  if (!requestedFields) {
    return data;
  }

  const fieldsArray = requestedFields.split(',').map(field => field.trim());
  const filteredData = {};

  for (const field of fieldsArray) {
    if (data.hasOwnProperty(field)) {
      filteredData[field] = data[field];
    }
  }

  return filteredData;
}

router.get('/:ip', async (req, res) => {
  const { ip } = req.params;
  const { output, fields, callback } = req.query;

  try {
    const response1 = await axios.get(`http://ipwho.is/${ip}`);
    const data1 = response1.data;

    if (!data1.success) {
      return res.status(404).json({ error: 'IP address not found or invalid.' });
    }

    const response2 = await axios.get(`http://ip-api.com/json/${ip}?fields=mobile,proxy,hosting`);
    const data2 = response2.data;

    const ipType = ip.includes(':') ? 'IPv6' : 'IPv4';

    const isTor = isTorExitNode(ip);

    let result = {
      ip,
      success: data1.success,
      message: data1.message,
      type: ipType,
      continent: data1.continent,
      continent_code: data1.continent_code,
      country: data1.country,
      country_code: data1.country_code,
      region: data1.region,
      region_code: data1.region_code,
      city: data1.city,
      coordinates: `${data1.latitude}, ${data1.longitude}`,
      postalCode: data1.postal,
      callingCode: `+${data1.calling_code || ''}`,
      timezoneID: data1.timezone.id,
      isp: data1.connection.isp,
      org: data1.connection.org,
      asn: `${data1.connection.asn} ${data1.connection.org}`,
      mobile: data2.mobile || false,
      proxy: data2.proxy || false,
      hosting: data2.hosting || false,
      vpn: data2.proxy || data2.hosting,
      tor: isTor,
      utc: new Date().toUTCString(),
    };

    result = filterFields(result, fields);

    let responseContent;
    let contentType = 'application/json';
    switch (output) {
      case 'xml':
        responseContent = js2xml({ response: result }, { compact: true, spaces: 4 });
        contentType = 'application/xml';
        break;
      case 'csv':
        responseContent = parse(result);
        contentType = 'text/csv';
        break;
      default:
        responseContent = JSON.stringify(result);
    }

    if (callback) {
      responseContent = `${callback}(${responseContent})`;
      contentType = 'application/javascript';
    }

    res.setHeader('Content-Type', contentType);
    return res.send(responseContent);

  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Error retrieving IP data' });
  }
});

module.exports = router;
