
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "FROM_BACKGROUND") {
        console.log("log" + request.switchId, request.switchState);

        chrome.storage.local.set({ [request.switchId]: request.switchState }, function () {
        });

    }
    return true;
});

function getSwitchState(switchId) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([switchId], function (result) {
            const res = result[switchId] || false;
            console.log("log content " + res);
            resolve(res);
        });
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "RADIO_FROM_BACKGROUND") {
        chrome.storage.local.set({ 'radio': request.selectedOption }, function () {
        });
    }
    return true;
});

function getRadioButton() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['radio'], function (result) {
            resolve(result.radio);
        });
    });
}