//document.body.style.border = "5px solid red";
console.log('running rileys extensions');






// update:
// biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);

//document.addEventListener("DOMContentLoaded", function() { 
(function main() {

    const getMediaSources = (audioCtx) => {
        let videos = Array.from(document.getElementsByTagName('video'));
        let audio = Array.from(document.getElementsByTagName('audio'));
        console.log('videos ', videos);
        console.log('audio ', audio);
    
        let all = videos.concat(audio);
    
        let allMediaSources = all.map((mediaElement) => {
            mediaElement.crossOrigin="anonymous";
            return audioCtx.createMediaElementSource(mediaElement);
        });
    
        return allMediaSources;
    }
    
    const createFilters = (source, audioCtx) => {
        console.log('createFilter');
        //mediaElement.crossOrigin="anonymous";
        //let source = audioCtx.createMediaElementSource(mediaElement);
        //mediaSources.push(source);
        console.log(source);
        biquadFilter = audioCtx.createBiquadFilter();
    
        source.connect(biquadFilter);
    
        biquadFilter.type = "lowpass";
    
        biquadFilter.connect(audioCtx.destination);
    }
    
    const updateFilters = () => {
        console.log('updateFilter');
        biquadFilter.type = "lowpass";
        biquadFilter.frequency.value = 700;
        biquadFilter.Q.value = 1;
    }

    console.log('this function runs');
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;
        
    if (false) {
        document.body.style.border = "5px solid red";
        console.log('running rileys extensions');

        //let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        //let audioElement = document.getElementById("audioPlayer");
        console.log('media elements: ', getMediaElements());
        getMediaElements().forEach((mediaElement) => {
            console.log(mediaElement);
            createFilters(mediaElement, audioCtx);
        });
    }

    let audioCtx = undefined;
    let biquadFilter = null;
    let mediaSources = undefined;

    //let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    console.log('initializing biquad');
    

    function activate() {
        console.log('activate');
        console.log(mediaSources);
        //
        //biquadFilter = null;
        if (!audioCtx) {
            console.log('defining audioCtx');
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } else {
            console.log('audioCtx already defined');
        }

        if (!mediaSources) {
            console.log('defining mediaSources');
            mediaSources = getMediaSources(audioCtx);
        } else {
            console.log('mediaSources already defined');
        }
        
        

        
        mediaSources.forEach((mediaElement) => {
            console.log(mediaElement);
            console.log('biquad filter', biquadFilter);
            if (!biquadFilter) {
                createFilters(mediaElement, audioCtx);
            }
            updateFilters();
            console.log('biquad filter after update', biquadFilter.frequency.value);
        });
    } 

    function deactivate() {
        console.log('deactivate');
        console.log('biquadFilter before disconnect', biquadFilter);
        //biquadFilter.disconnect();
        biquadFilter.frequency.value = 20000;
        console.log('biquadFilter after disconnect', biquadFilter);
        console.log('mediaSources: ', mediaSources);
        // mediaSources.forEach((source) => {
        //     source.connect(audioCtx.destination)
        // });
        // biquadFilter = null;
        console.log('biquadFilter after reconnecting and nulling');
    }

    browser.runtime.onMessage.addListener((message) => {
        console.log('receiving message');
        if (message.command === "activate") {
            activate();
        } else if (message.command === "deactivate") {
            deactivate();
        }
      });

})();



//manifest json stuff:
// "content_scripts": [
//     {
//       "matches": ["*://*/*"],
//       "js": ["audioeq.js"]
//     }
//   ]
