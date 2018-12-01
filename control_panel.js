console.log('starting');
let appState = 'unitialized';
console.log('appState: ', appState);

async function toggleFilter(event) {
    console.log('toggling on off', event.target.checked);
    const state = await browser.storage.local.get()
    console.log()
    console.log(typeof state.lowPassVal)
    if (event.target.checked) {
        browser.storage.local.set({'onOff': true})
        browser.tabs.query({active: true, currentWindow: true})
            .then(function(tabs) {
                console.log('sending message to tab: ', tabs[0]);
                browser.tabs.sendMessage(tabs[0].id, {
                    command: "activate",
                    lowPassVal: getLogValue(state.lowPassVal),
                    highPassVal: getLogValue(state.highPassVal)
                })
            })   
            .catch((error) => {
                console.log('error', error)
            });
    } else {
        browser.storage.local.set({'onOff': false})
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
    browser.storage.local.set({'lowPassVal': event.target.value})
    browser.tabs.query({active: true, currentWindow: true})
        .then(function(tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                command: "updateLowPass",
                value: getLogValue(event.target.value)
            });
        })   
        .catch((error) => {
            console.log('error', error)
        });
}

function updateHighPass(event) {
    browser.storage.local.set({'highPassVal': event.target.value})
    browser.tabs.query({active: true, currentWindow: true})
        .then(function(tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                command: "updateHighPass",
                value: getLogValue(event.target.value)
            });
        })   
        .catch((error) => {
            console.log('error', error)
        });
}

function getLogValue(position) {
    // position will be between 0 and 100
    var minp = 0;
    var maxp = 100;
  
    // The result should be between 100 an 10000000
    var minv = Math.log(2);
    var maxv = Math.log(20000);
  
    // calculate adjustment factor
    var scale = (maxv-minv) / (maxp-minp);
    return Math.round(Math.exp(minv + scale*(position-minp)));
  }

async function addListeners () {
    await browser.storage.local.set({'sartingApp': 'true'})
    console.log('adding listeners');
    console.log
    const onOff = document.getElementById('onoff');
    const lowpass = document.getElementById('lowpass');
    const highpass = document.getElementById('highpass');
    const state = await browser.storage.local.get()
    onOff.checked = state.onOff
    lowpass.value = state.lowPassVal
    highpass.value = state.highPassVal
    console.log(state)
    console.log(await browser.storage.local.get())
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
//.then(addListeners)
.catch(reportExecuteScriptError);
  