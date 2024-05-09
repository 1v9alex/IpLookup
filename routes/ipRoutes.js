const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/:ip', async (req, res) => {
  const { ip } = req.params;

  try {
    const response1 = await axios.get(`http://ipwho.is/${ip}`);
    const data1 = response1.data;

    if (!data1.success) {
      return res.status(404).json({ error: 'IP address not found or invalid.' });
    }

    const ipType = ip.includes(':') ? 'IPv6' : 'IPv4';

    const response2 = await axios.get(`http://ip-api.com/json/${ip}?fields=mobile,proxy,hosting`);
    const data2 = response2.data;

    const result = {
        ip: data1.ip,
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
        utc: new Date().toUTCString(),
        mobile: data2.mobile,
        proxy: data2.proxy,
        hosting: data2.hosting,
    };

    return res.json(result);
} catch (error) {
    return res.status(500).json({ error: 'Error retrieving IP data' });
}
});

module.exports = router;
