/*This file is the communication bridge between the popup script and the content scripts
as per manifest V3 standards they run on different contexts and environments.
*/

//Listens for messages from the popup script containing the toggle switch states and send them to the content script.
'use strict';

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "FROM_POPUP") {
    const tabId = request.tabId;
    chrome.tabs.sendMessage(tabId, {
      switchId: request.switchId,
      switchState: request.switchState,
      type: "FROM_BACKGROUND"
    });
  }
});

//Listens for messages from the popup script containing the radio button states and send them to the content script.
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "RADIO_FROM_POPUP") {
    const tabId = request.tabId;
    chrome.tabs.sendMessage(tabId, {
      selectedOption: request.selectedOption,
      type: "RADIO_FROM_BACKGROUND"
    });
  }
});

//Open log page on a new tab from the game tab
chrome.runtime.onMessage.addListener(function (request) {
  if (request.action === 'openNewTab') {
    const url = `chrome-extension://${chrome.runtime.id}/log.html`;
    chrome.tabs.create({ url: url });
  }
});

//Spoof user agent to load mobile mode 
// Store the tab IDs that have already been processed
const processedTabs = new Set();

// Define the static user agent
const staticUserAgent = 'Mozilla/5.0 (Linux; Android 13; Pixel 7 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36';

// This function handles the logic to update session rules and reload the tab
async function updateUserAgent(tab) {
  // Check if the tab has already been processed
  if (processedTabs.has(tab.id)) {
    return;
  }

  processedTabs.add(tab.id);

  // Remove any existing rules for the tab
  await chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [tab.id]
  });

  // Add a new rule for the static user agent
  await chrome.declarativeNetRequest.updateSessionRules({
    addRules: [{
      'id': tab.id,
      'action': {
        'type': 'modifyHeaders',
        'requestHeaders': [{
          'header': 'user-agent',
          'operation': 'set',
          'value': staticUserAgent
        }]
      },
      'condition': {
        'tabIds': [tab.id],
        'resourceTypes': [
          'main_frame', 'sub_frame', 'stylesheet', 'script', 'image', 'font', 'object', 'xmlhttprequest', 'ping',
          'csp_report', 'media', 'websocket', 'webtransport', 'webbundle', 'other'
        ]
      }
    }]
  });

  // Reload the tab
  chrome.tabs.reload(tab.id, {
    bypassCache: false
  });
}

// Run the logic when a tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    updateUserAgent(tab);
  }
});

// Run the logic when a new tab is created
chrome.tabs.onCreated.addListener(tab => {
  updateUserAgent(tab);
});

// Remove session rules when a tab is removed
chrome.tabs.onRemoved.addListener(tabId => {
  chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [tabId]
  });
  // Remove the tab from the processedTabs set
  processedTabs.delete(tabId);
});