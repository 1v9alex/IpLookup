
document.getElementById('search-button').addEventListener('click',(e) => {
    e.preventDefault();

    let targetIp = document.getElementById('ipInput').value;
    getInfo(`${targetIp}`);
});


async function getInfo(IpAddress){
    try{
        const response = await fetch(`http://ipwho.is/${IpAddress}`);
        if(!response.ok){
            throw new Error('Network Error')
        }
        const data = await response.json();
    

        const ip = document.getElementById('ipInput').value;
        updateElement('targetIp',`Target Ip: ${ip}`);
        updateElement('ipType',`Type: ${data.type}`);
        updateElement('continent',`Continent: ${data.continent}`);
        updateElement('continentCode',`Continent Code: ${data.continentCode}`);
        updateElement('country',`Country: ${data.country}`);
        updateElement('countryCode',`Country Code: ${data.countryCode}`);
        updateElement('region',`Region: ${data.region}`);
        updateElement('regionCode',`Region Code: ${data.regionCode}`);
        updateElement('city',`City: ${data.city}`);
        updateElement('coordinates',`Coordinates: ${data.latitude},${data.longitude}`);
        updateElement('postalCode',`Postal Code: ${data.postalCode}`);
        updateElement('callingCode',`Country Code: +${data.callingCode}`);
    
        updateElement('asn',`ASN: ${data.connection.asn}`);
        updateElement('org',`ORG: ${data.connection.org}`);
        updateElement('isp',`ISP: ${data.connection.isp}`);
    
        updateElement('timezoneID',`Timezone ID: ${data.timezone.id}`);
        updateElement('timezoneABBR',`Timezone Abbr: ${data.timezone.abbr}`);
        updateElement('utc',`UTC: ${data.timezone.utc}`);
        updateElement('currentTime',`Current Time: ${data.timezone.current_time}`);
    }
    catch (error) {
        console.error('Error fetching Ip data:', error);
        alert('Failed to retrieve Ip data. Please try the console again.');
    }
}

function updateElement(id,text){
    const element = document.getElementById(id);

    if(element){
        element.textContent = text;
    }
    else{
        console.warn(`Element with ID ${id} not found.`);
    }
}