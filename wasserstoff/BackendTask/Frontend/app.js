async function sendRequest() {
  const apiType = document.getElementById('apiType').value;
  const payloadSize = document.getElementById('payloadSize').value;
  const queueType = document.getElementById('queueType').value;
  const url = `http://localhost:4000/api/request?apiType=${apiType}&payloadSize=${payloadSize}&queueType=${queueType}`;
  const requestData = { payloadSize: payloadSize };

  try {
    const response = await fetch(url, {
      method: apiType === 'REST' ? 'GET' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: apiType === 'REST' ? null : JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    document.getElementById('response').innerText = JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('response').innerText = `Error: ${error.message}`;
  }
}