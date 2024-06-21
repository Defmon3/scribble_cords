// ==UserScript==
// @name         Extract Lat/Long from Scribble Maps URL
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extracts latitude and longitude from the Scribble Maps URL on right-click
// @author       Defmon3
// @match        *://www.scribblemaps.com/create*
// @grant        GM_setClipboard
// @updateURL    https://raw.githubusercontent.com/defmon3/scribble_cords/main/scribble_cords.js
// @downloadURL  https://raw.githubusercontent.com/defmon3/scribble_cords/main/scribble_cords.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract lat/long from URL
    function extractLatLongFromURL(url) {
        const urlParams = new URLSearchParams(url.split('#')[1]);
        const lat = urlParams.get('lat');
        const lng = urlParams.get('lng');

        if (lat && lng) {
            return `${lat}, ${lng}`;
        } else {
            return 'Latitude and/or Longitude not found in URL';
        }
    }

    // Function to handle right-click
    function handleRightClick(event) {
        // Prevent the default context menu from appearing
        event.preventDefault();

        const url = window.location.href;
        const text = extractLatLongFromURL(url);
        GM_setClipboard(text, 'text');
    }

    // Add event listener for right-click
    document.addEventListener('contextmenu', handleRightClick, true);

})();
