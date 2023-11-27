

function getMapMatrix(arrayOfMarkers) {
    //arrayOfMarkers holds the vibe and set markers.

    //Get captain units.
    //Get ally units.
    const arrayOfBattleFieldUnitClickAreas = Array.from(document.querySelectorAll(".allyUnit"));
    const captainName = document.querySelector(".captainButtonActive.captainButtonImg").alt;
    let captainUnit;
    let icon = "";

    //Open leaderboard
    document.querySelector(".leaderboardCont").click();

    const allPlacers = document.querySelectorAll(".battlefieldLeaderboardRowCont");
    for (let i = 0; i < allPlacers.length; i++) {
        const row = allPlacers[i];
        if (row.querySelector(".battlefieldLeaderboardRowDisplayName").innerText === captainName) {
            icon = row.querySelector(".battlefieldLeaderboardRowUnitIconsCont .battlefieldLeaderboardRowUnitIconWrapper img").src;
            closeAll()
        }
    }

    outerLoop: for (let i = 0; i < arrayOfBattleFieldUnitClickAreas.length; i++) {
        const captain = arrayOfBattleFieldUnitClickAreas[i];
        const captainIcon = captain.querySelector("img").src;
        if (captainIcon === icon) {
            for (let j = arrayOfBattleFieldUnitClickAreas.length - 1; j >= 0; j--) {

                const lastUnitSize = arrayOfBattleFieldUnitClickAreas[j].querySelector(".battleFieldUnitClickArea").offsetWidth;
                const captainSizeForComparison = captain.querySelector(".battleFieldUnitClickArea").offsetWidth;

                if (lastUnitSize * 2 === captainSizeForComparison) {
                    captainUnit = captain;
                    break outerLoop;
                } else if (captainSizeForComparison / 2 == lastUnitSize) {

                    break;
                } else if (captainSizeForComparison === lastUnitSize) {
                    continue;
                }
            }
        }
    }

    const captainRect = captainUnit.getBoundingClientRect();
    const elementSize = captainRect.width;

    const divisionSize = (elementSize / 8) * 3;

    const captainTop = captainRect.top + divisionSize;
    const captainLeft = captainRect.left + divisionSize;

    const reducedElementSize = (elementSize / 8) * 2;

    const sortedArray = [];

    for (let i = 0; i < arrayOfMarkers.length; i++) {
        const marker = arrayOfMarkers[i];
        const markerRect = marker.getBoundingClientRect();

        const markerTop = markerRect.top;
        const markerLeft = markerRect.left;

        const squaredDistance = (
            Math.pow(markerTop - captainTop, 2) +
            Math.pow(markerLeft - captainLeft, 2) +
            Math.pow(markerRect.width - reducedElementSize, 2) +
            Math.pow(markerRect.height - reducedElementSize, 2)
        );

        sortedArray.push({ marker, squaredDistance });
    }

    sortedArray.sort((a, b) => a.squaredDistance - b.squaredDistance);

    return sortedArray.map(item => item.marker);

}