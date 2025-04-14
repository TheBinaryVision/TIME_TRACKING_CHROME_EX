document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:5000/api/report')
      .then(response => response.json())
      .then(data => {
        const reportList = document.getElementById('report-list');
        reportList.innerHTML = '';
  
        const labels = [];
        const values = [];
        const colors = [];
  
        if (data && data.length > 0) {
          data.forEach(entry => {
            const li = document.createElement('li');
            li.innerHTML = `
              <span class="domain">${entry.domain}</span>
              <span class="time">${formatTime(entry.totalTime)}</span>
            `;
            reportList.appendChild(li);
  
            // Add data for chart
            labels.push(entry.domain);
            values.push(entry.totalTime);
            colors.push(getRandomColor());
          });
  
          renderChart(labels, values, colors);
        } else {
          reportList.innerHTML = '<li>No activity recorded.</li>';
        }
      })
      .catch(error => {
        console.error('Error fetching report:', error);
        document.getElementById('report-list').innerHTML =
          '<li>Error fetching report</li>';
      });
  });
  
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  }
  
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  function renderChart(labels, values, colors) {
    const ctx = document.getElementById('reportChart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Time Spent',
          data: values,
          backgroundColor: colors
        }]
      },
      options: {
        responsive: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          }
        }
      }
    });
  }
  