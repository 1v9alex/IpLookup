function updateElement(id, text) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = text;
    }
  }
  
  async function fetchIPInfo(ipAddress) {
    try {
      const response = await fetch(`http://localhost:3000/api/ip/${ipAddress}`);
      const data = await response.json();
  
      if (response.ok) {
        updateElement('targetIp', `IP: ${data.ip}`);
        updateElement('type', `Type: ${data.type}`);
        updateElement('continent', `Continent: ${data.continent}`);
        updateElement('continent_code', `Continent Code: ${data.continent_code}`);
        updateElement('country', `Country: ${data.country}`);
        updateElement('country_code', `Country Code: ${data.country_code}`);
        updateElement('region', `Region: ${data.region}`);
        updateElement('region_code', `Region Code: ${data.region_code}`);
        updateElement('city', `City: ${data.city}`);
        updateElement('coordinates', `Coordinates: ${data.coordinates}`);
        updateElement('postalCode', `Postal Code: ${data.postalCode}`);
        updateElement('callingCode', `Calling Code: ${data.callingCode}`);
        updateElement('timezoneID', `Timezone ID: ${data.timezoneID}`);
        updateElement('isp', `ISP: ${data.isp}`);
        updateElement('org', `Organization: ${data.org}`);
        updateElement('asn', `ASN: ${data.asn}`);
        updateElement('mobile', `Mobile: ${data.mobile}`);
        updateElement('proxy', `Proxy: ${data.proxy}`);
        updateElement('hosting', `Hosting: ${data.hosting}`);
        updateElement('vpn', `VPN: ${data.vpn}`);
        updateElement('tor', `Tor: ${data.tor}`);
        updateElement('utc', `UTC: ${data.utc}`);
      } else {
        updateElement('targetIp', `Error: ${data.error}`);
      }
    } catch (error) {
      updateElement('targetIp', `Error fetching IP data: ${error.message}`);
    }
  }
  
  document.getElementById('search-button').addEventListener('click', (e) => {
    e.preventDefault();
    const ipInput = document.getElementById('ipInput').value.trim();
    if (ipInput) {
      fetchIPInfo(ipInput);
    } else {
      updateElement('targetIp', 'Please enter a valid IP address.');
    }
  });
  