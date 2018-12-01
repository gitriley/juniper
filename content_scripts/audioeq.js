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
    
    const createFilter = (source, audioCtx) => {
        console.log('createFilter');
        //mediaElement.crossOrigin="anonymous";
        //let source = audioCtx.createMediaElementSource(mediaElement);
        //mediaSources.push(source);
        console.log(source);
        lowPassFilter = audioCtx.createBiquadFilter();
        highPassFilter = audioCtx.createBiquadFilter();
    
        source.connect(lowPassFilter);
        lowPassFilter.connect(highPassFilter);
    
        lowPassFilter.type = "lowpass";
        highPassFilter.type = "highpass";
    
        highPassFilter.connect(audioCtx.destination);
        //lowPassFilter.connect(audioCtx.destination);
    }
    
    const updateLowPassFilter = (frequency) => {
        console.log('lowpass freq: ', frequency);
        console.log('highpass freq: ', highPassFilter.frequency.value);
        lowPassFilter.type = "lowpass";
        lowPassFilter.frequency.value = frequency;
        lowPassFilter.Q.value = 1;
    }

    const updateHighPassFilter = (frequency) => {
        console.log('lowpass freq: ', lowPassFilter.frequency.value);
        console.log('highpass freq: ', frequency);
        highPassFilter.type = "highpass";
        highPassFilter.frequency.value = frequency;
        highPassFilter.Q.value = 1;
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
    //let biquadFilter = null;
    let lowPassFilter = null;
    let highPassFilter = null;
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
            if (!lowPassFilter) {
                createFilter(mediaElement, audioCtx);
            }
            updateLowPassFilter(20000);
            updateHighPassFilter(0);
        });
    } 

    function deactivate() {
        console.log('deactivate');
        //biquadFilter.disconnect();
        if (!lowPassFilter) {
            return
        }
        lowPassFilter.frequency.value = 20000;
        highPassFilter.frequency.value = 0;
        
        // mediaSources.forEach((source) => {
        //     source.connect(audioCtx.destination)
        // });
        // biquadFilter = null;
    }

    browser.runtime.onMessage.addListener((message) => {
        console.log('receiving message');
        if (message.command === 'activate') {
            activate();
        } else if (message.command === 'deactivate') {
            deactivate();
        } else if (message.command === 'updateHighPass') {
            console.log('update highpass')
            updateHighPassFilter(message.value);
        } else if (message.command === 'updateLowPass') {
            console.log('update lowpass')
            updateLowPassFilter(message.value);
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
