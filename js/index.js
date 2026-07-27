/* 
Note: The magic numbers in the code don't have any hidden mathematical meaning;
they simply represent what I thought looked best


*/





const loadSimulations = () => {
    
    // lorenzIframe.contentWindow.postMessage('play');
};
window.onmessage = message => {
    if (message.source === lorenzIframe.contentWindow && message.data === 'ready') {
        setLorenz();
        lorenzObserver.observe(lorenzIframe);
    }
}

window.onresize = resize;

// window.addEventListener('DOMContentLoaded', resize);
window.onload = () => {
    setBH();
    setS();
};

// for (let i = 0; i < 4; i ++) {
//     window.setTimeout(async () => {
//         const pr = window.scrollTo(0, document.body.scrollHeight);
//         // console.log(pr);
//         // console.log(await pr);
//         console.log('did it work?', i)
//     }, 100 + i * 200)
// }