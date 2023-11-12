
//Declaring/Initializing variables
let chestName;
let url;
const colorCodeMap = {
    "rgb(185, 242, 255)": "Blue",
    "rgb(255, 204, 203)": "Red",
    "rgb(203, 195, 227)": "Purple",
};
const battleChests = [
    { key: "tbd", name: "tbd", url: "https://d2k2g0zg1te1mr.cloudfront.net/mobilelite/chests/iconChestSalvage.7f5d2511b08f.png" },
    { key: "unknown", name: "abandoned", url: "https://d2k2g0zg1te1mr.cloudfront.net/mobilelite/chests/iconChestSalvage.7f5d2511b08f.png" },
    { key: "abandoned", name: "abandoned", url: "https://d2k2g0zg1te1mr.cloudfront.net/mobilelite/chests/iconChestSalvage.7f5d2511b08f.png" },
    { key: "chestsalvage", name: "Defeat", url: "https://d2k2g0zg1te1mr.cloudfront.net/mobilelite/chests/iconChestSalvage.7f5d2511b08f.png" },
    { key: "chestbronze", name: "Bronze", url: "https://d2k2g0zg1te1mr.cloudfront.net/mobilelite/chests/iconChestBronze.7f5d2511b08f.png" },
    { key: "chestsilver", name: "Silver", url: "https://d2k2g0zg1te1mr.cloudfront.net/mobilelite/chests/iconChestSilver.7f5d2511b08f.png" },
    { key: "chestgold", name: "Gold", url: "https://d2k2g0zg1te1mr.cloudfront.net/mobilelite/chests/iconChestGold.7f5d2511b08f.png" },
    { key: "chestboostedgold", name: "Loyalty Gold", url: "https://d2k2g0zg1te1mr.cloudfront.net/mobilelite/chests/iconChestGoldBoosted.c0e0bcd2b145.png" },
    { key: "chestboostedskin_maps01to11", name: "Loyalty Skin", url: "https://d2k2g0zg1te1mr.cloudfront.net/mobilelite/chests/iconChestSkinBoosted.c0e0bcd2b145.png " },
    { key: "chestboostedscroll", name: "Loyalty Scroll", url: "https://d2k2g0zg1te1mr.cloudfront.net/mobilelite/chests/iconChestScrollBoosted.ff3678509435.png" },
    { key: "chestboostedtoken", name: "Loyalty Token", url: "https://d2k2g0zg1te1mr.cloudfront.net/mobilelite/chests/iconChestTokenBoosted.c0e0bcd2b145.png" },
    { key: "chestboss", name: "Loyalty Boss", url: "https://d2k2g0zg1te1mr.cloudfront.net/mobilelite/chests/iconChestBoss.7f5d2511b08f.png" },
    { key: "chestbosssuper", name: "Loyalty Super Boss", url: "https://d2k2g0zg1te1mr.cloudfront.net/mobilelite/chests/iconChestBossSuper.c0e0bcd2b145.png" },
];

//Event listener for when the page loads
document.addEventListener('DOMContentLoaded', function () {
    // Retrieve data from local storage
    chrome.storage.local.get(['logData'], function (result) {
        const arrayData = result.logData || [];

        // Sort the array based on the time they were added.
        const sortedData = arrayData.sort((a, b) => new Date(b.currentTime) - new Date(a.currentTime));

        // Get the data container div
        const dataContainer = document.getElementById('dataContainer');
        dataContainer.style.textAlign = "justify";

        // Create a table 
        const tableElement = document.createElement('table');

        // Create table header row
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = '<th>#</th><th>Slot</th><th>Captain Name</th><th>Mode</th><th>Color Code</th><th>Start time</th><th>Duration</th><th>Result</th><th>Chest</th>';

        // Append header row to the table
        tableElement.appendChild(headerRow);

        // Populate the table with array data
        let counter = 1;
        sortedData.forEach(entry => {
            let chestName;
            let url;
            // Convert the string to a Date object
            const startTime = new Date(entry.currentTime);
            const startHour = startTime.getHours();
            const startMinute = startTime.getMinutes();

            // Using padStart to ensure two digits for hours and minutes
            const startingTime = String(startHour).padStart(2, '0') + ":" + String(startMinute).padStart(2, '0');

            //Getting human readable colors
            const color = colorCodeMap[entry.colorCode] || "Normal";

            /*
            if ((!color.includes("Normal") && !color.includes("Purple")) && entry.elapsedTime === "-1") {
                entry.elapsedTime = "No time available";
                entry.result = "Didn't/Won't join."
            } else {
                if (parseInt(entry.elapsedTime) >= 80 || entry.currentTime === entry.elapsedTime) {
                    entry.elapsedTime = "Time unknown."
                }
                else {
                    entry.elapsedTime = `${entry.elapsedTime} minutes.`;
                }
            }
            */

            //Getting human readable chest name and picture
            for (const battleChest of battleChests) {
                if (battleChest.key.includes(entry.chest)) {
                    chestName = battleChest.name;
                    url = battleChest.url;
                    break;
                }
            }
            // Create a table row
            const row = document.createElement('tr');
            row.innerHTML = `<td>${counter}</td>
            <td>${entry.logId}</td>
            <td>${entry.logCapName}</td>
            <td>${entry.logMode}</td>
            <td style="border: 1px solid #ddd; padding: 8px; color: ${color};">${color}</td>
            <td>${startingTime}</td><td>${entry.elapsedTime}</td>
            <td>${entry.result}</td>
            <td style="text-align: center; vertical-align: middle;">
                <div style="display: flex; flex-direction: column; align-items: center;">
                     ${chestName}
                     <img src="${url}" alt="Chest Image" style="height: 30px; width: auto">
                </div>
            </td>
  `;
            // Append the row to the table
            tableElement.appendChild(row);
            counter++
        });

        // Append the table to the data container
        dataContainer.appendChild(tableElement);

        // Add event listener for the wipe button
        document.getElementById('wipeButton').addEventListener('click', function () {
            // Wipe logData from local storage
            chrome.storage.local.remove(['logData'], function () {
                console.log('logData wiped from local storage');
                // Optionally, you can also clear the displayed data on the options page
                dataContainer.innerHTML = '';
            });
        });
    });
});