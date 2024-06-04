async function sendRequest() {
    const apiType = document.getElementById("apiType").value;
    const payloadSize = document.getElementById("payloadSize").value;
    const method = apiType === "REST" ? "GET" : "POST"; // Determine request method based on API type
    const url = `http://localhost:4000/api/request?apiType=${apiType}&payloadSize=${payloadSize}`;
    const requestData = { payloadSize: payloadSize }; // Use payloadSize instead of sample data

    try {
      const response = await fetch(url, {
        method: method, // Use determined method
        headers: {
          "Content-Type": "application/json",
        },
        body: method === "POST" ? JSON.stringify(requestData) : null, // Send body for POST requests only
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      document.getElementById("response").innerText = JSON.stringify(
        data,
        null,
        2
      );
    } catch (error) {
      console.error("Error:", error);
      document.getElementById(
        "response"
      ).innerText = `Error: ${error.message}`;
    }
  }