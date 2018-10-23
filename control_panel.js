console.log('starting');

function toggleFilter(event) {
    console.log('toggling on off', event.target.checked);
    if (event.target.checked) {
        browser.tabs.query({active: true, currentWindow: true})
            .then(function(tabs) {
                console.log('sending message to tab: ', tabs[0]);
                browser.tabs.sendMessage(tabs[0].id, {command: "activate"})
            })   
            .catch((error) => {
                console.log('error', error)
            });
    } else {
        browser.tabs.query({active: true, currentWindow: true})
            .then(function(tabs) {
                console.log('sending message to tab: ', tabs[0]);
                browser.tabs.sendMessage(tabs[0].id, {command: "deactivate"})
            })   
            .catch((error) => {
                console.log('error', error)
            });
    }
}

function updateLowPass(event) {
    browser.tabs.query({active: true, currentWindow: true})
        .then(function(tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                command: "updateLowPass",
                value: event.target.value
            });
        })   
        .catch((error) => {
            console.log('error', error)
        });
}

function updateHighPass(event) {
    browser.tabs.query({active: true, currentWindow: true})
        .then(function(tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                command: "updateHighPass",
                value: event.target.value
            });
        })   
        .catch((error) => {
            console.log('error', error)
        });
}

function addListeners() {
    console.log('adding listeners');
    const onOff = document.getElementById('onoff');
    const lowpass = document.getElementById('lowpass');
    const highpass = document.getElementById('highpass');

    onOff.addEventListener('change', toggleFilter, false);
    lowpass.addEventListener('change', updateLowPass, false);
    highpass.addEventListener('change', updateHighPass, false);
}

function reportExecuteScriptError(error) {
    console.error(`Failed to execute content script: ${error}`);    
}
  
/**
   * When the popup loads, inject a content script into the active tab,
   * and add a click handler.
   * If we couldn't inject the script, handle the error.
*/
addListeners();
browser.tabs.executeScript({file: "/content_scripts/audioeq.js"})
.then(addListeners)
.catch(reportExecuteScriptError);
  