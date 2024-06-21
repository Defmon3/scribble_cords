// ==UserScript==
// @name         Extract Lat/Long from Scribble Maps URL
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Extracts latitude and longitude from the Scribble Maps URL on right-click
// @author       Defmon3
// @match        *://www.scribblemaps.com/create*
// @grant        GM_setClipboard
// @updateURL    https://raw.githubusercontent.com/defmon3/scribble_cords/main/scribble_cords.js
// @downloadURL  https://raw.githubusercontent.com/defmon3/scribble_cords/main/scribble_cords.js

// ==/UserScript==
(function() {
    'use strict';

    // Function to extract lat/long from URL hash
    function extractLatLongFromURL(url) {
        const hashIndex = url.indexOf('#');
        if (hashIndex === -1) {
            return 'No hash found in URL';
        }

        let hashParams = url.substring(hashIndex + 1);
        if (hashParams.startsWith('/')) {
            hashParams = hashParams.substring(1); // Remove leading slash
        }

        const params = new URLSearchParams(hashParams);
        const lat = params.get('lat');
        const lng = params.get('lng');

        if (lat && lng) {
            return `${lat}, ${lng}`;
        } else {
            return 'Latitude and/or Longitude not found in URL';
        }
    }

    // Function to handle right-click and show custom context menu
    function handleRightClick(event) {
        if (!event.shiftKey) {
            return; // Only show menu if Shift key is pressed
        }
        event.preventDefault();

        // Remove any existing custom context menu
        const existingMenu = document.getElementById('customContextMenu');
        if (existingMenu) {
            existingMenu.remove();
        }

        // Create custom context menu
        const menu = document.createElement('div');
        menu.id = 'customContextMenu';
        menu.style.position = 'absolute';
        menu.style.top = `${event.clientY}px`;
        menu.style.left = `${event.clientX}px`;
        menu.style.backgroundColor = '#fff';
        menu.style.border = '1px solid #ccc';
        menu.style.padding = '8px';
        menu.style.zIndex = 10000;
        menu.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';

        // Extract Lat/Long menu item
        const extractMenuItem = document.createElement('div');
        extractMenuItem.innerText = 'Extract Lat/Long';
        extractMenuItem.style.cursor = 'pointer';
        extractMenuItem.style.marginBottom = '8px';
        extractMenuItem.addEventListener('click', function() {
            const url = window.location.href;
            const text = extractLatLongFromURL(url);
            GM_setClipboard(text, 'text');
            showNotification(`Copied: ${text}`);
            menu.remove();
        });

        // Show/Hide element menu item
        const toggleMenuItem = document.createElement('div');
        const label = document.createElement('label');
        label.innerText = 'Show/Hide Element';
        label.htmlFor = 'toggleElementCheckbox';
        label.style.marginRight = '8px';
        label.style.cursor = 'pointer';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'toggleElementCheckbox';
        checkbox.checked = !isElementHidden();
        checkbox.style.cursor = 'pointer';

        toggleMenuItem.appendChild(label);
        toggleMenuItem.appendChild(checkbox);
        toggleMenuItem.style.cursor = 'pointer';

        checkbox.addEventListener('change', function() {
            toggleElementVisibility();
        });

        menu.appendChild(extractMenuItem);
        menu.appendChild(toggleMenuItem);
        document.body.appendChild(menu);

        // Remove custom context menu on click outside
        document.addEventListener('click', function removeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', removeMenu);
            }
        });
    }

    // Function to show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.innerText = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = '#fff';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
        notification.style.zIndex = 10001;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 1000); // Display for 1 second
    }

    // Function to toggle element visibility
    function toggleElementVisibility() {
        const element = document.evaluate("/html/body/div[1]/div[3]/div[2]/div/div[1]/div[23]/div[2]/div", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Element to toggle:', element);
        if (element) {
            if (element.style.display === 'none') {
                element.style.display = '';
                console.log('Element shown');
            } else {
                element.style.display = 'none';
                console.log('Element hidden');
            }
        } else {
            console.log('Element not found');
        }
    }

    // Function to check if element is hidden
    function isElementHidden() {
        const element = document.evaluate("/html/body/div[1]/div[3]/div[2]/div/div[1]/div[23]/div[2]/div", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Check if element is hidden:', element);
        return element && element.style.display === 'none';
    }

    // Add event listener for right-click
    document.addEventListener('contextmenu', handleRightClick, true);

})();