let activeTabId = null;
let activeStartTime = null;
let activeDomain = null;
const backendUrl = 'http://localhost:5000/api/activity';

// Log to confirm script is loaded
console.log("Background script loaded successfully!");

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
});

// Track when tab changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log("Tab Activated:", activeInfo);
  handleTabChange(activeInfo.tabId);
});

// Track when tab content finishes loading
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === 'complete') {
    console.log("Tab Updated:", tabId);
    handleTabChange(tabId);
  }
});

// Track window focus (user leaves or returns to Chrome)
chrome.windows.onFocusChanged.addListener((windowId) => {
  console.log("Window Focus Changed:", windowId);
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    endTracking();
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) handleTabChange(tabs[0].id);
    });
  }
});

// Handle active tab changes
function handleTabChange(tabId) {
  if (tabId === activeTabId) return;

  endTracking();

  chrome.tabs.get(tabId, (tab) => {
    if (chrome.runtime.lastError || !tab || !tab.url) return;

    try {
      const url = new URL(tab.url);
      activeTabId = tabId;
      activeStartTime = Date.now();
      activeDomain = url.hostname;
    } catch (e) {
      console.error("Invalid URL in tab:", tab.url);
    }
  });
}

// When tab is switched or user becomes inactive
function endTracking() {
  if (!activeStartTime || !activeDomain) return;

  const timeSpent = Math.floor((Date.now() - activeStartTime) / 1000); // in seconds

  // Save to localStorage
  chrome.storage.local.get(['timeData'], (result) => {
    const timeData = result.timeData || {};
    timeData[activeDomain] = (timeData[activeDomain] || 0) + timeSpent;

    chrome.storage.local.set({ timeData });
  });

  // Send to backend
  const activityData = {
    url: `https://${activeDomain}`,
    title: activeDomain,
    timeSpent,
    timestamp: new Date(),
  };

  sendToBackend(activityData);

  // Reset
  activeTabId = null;
  activeStartTime = null;
  activeDomain = null;
}

// Send activity to backend server
function sendToBackend(activityData) {
  fetch(`${backendUrl}/track`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(activityData),
  })
    .then(async (response) => {
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        console.log('Activity sent:', data);
      } catch (err) {
        console.error('Invalid JSON response from server:', text);
      }
    })
    .catch(error => console.error('Error sending activity:', error));
}

// Fetch weekly report (used in popup)
function fetchWeeklyReport() {
  fetch('http://localhost:5000/api/report')
    .then((response) => response.json())
    .then((data) => {
      console.log('Weekly Report:', data);
    })
    .catch((error) => console.error('Error fetching report:', error));
}

// Optional: pre-fetch weekly report at extension start
fetchWeeklyReport();
