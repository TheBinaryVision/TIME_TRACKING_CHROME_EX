// Function to fetch the weekly productivity report from the server
function fetchWeeklyReport() {
    document.getElementById('loading').style.display = 'block';  // Show loading
  
    fetch('http://localhost:5000/api/report')  // Update with your deployed URL later
      .then((response) => response.json())
      .then((data) => {
        document.getElementById('loading').style.display = 'none';  // Hide loading
  
        const { productiveTime, unproductiveTime, totalTime } = data;
        
        const reportContainer = document.getElementById('report');
        reportContainer.innerHTML = `
          <h2>Weekly Productivity Report</h2>
          <p><strong>Productive Time:</strong> ${formatTime(productiveTime)} hours</p>
          <p><strong>Unproductive Time:</strong> ${formatTime(unproductiveTime)} hours</p>
          <p><strong>Total Time:</strong> ${formatTime(totalTime)} hours</p>
        `;
      })
      .catch((error) => {
        document.getElementById('loading').style.display = 'none';  // Hide loading
        document.getElementById('report').innerHTML = 'Error fetching report';
        console.error('Error fetching report:', error);
      });
  }
  
  // Format time in seconds to hours:minutes:seconds
  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
  
  // Fetch the report when the page loads
  window.onload = function() {
    fetchWeeklyReport();
  };
  