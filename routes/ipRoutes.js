const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/:ip', async (req, res) => {
  const { ip } = req.params;

  try {
    const response = await axios.get(`http://ipwho.is/${ip}`);
    const data = response.data;

    if (!data.success) {
      return res.status(404).json({ error: 'IP address not found or invalid.' });
    }

    const ipType = ip.includes(':') ? 'IPv6' : 'IPv4';

    const result = {
      ip: data.ip,
      type: ipType,
      continent: data.continent,
      continent_code: data.continent_code,
      country: data.country,
      country_code: data.country_code,
      region: data.region,
      region_code: data.region_code,
      city: data.city,
      coordinates: `${data.latitude}, ${data.longitude}`,
      postalCode: data.postal,
      callingCode: `+${data.calling_code || ''}`,
      timezoneID: data.timezone.id,
      isp: data.connection.isp,
      org: data.connection.org,
      asn: `${data.connection.asn} ${data.connection.org}`,
      utc: new Date().toUTCString(),
    };

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Error retrieving IP data' });
  }
});

module.exports = router;