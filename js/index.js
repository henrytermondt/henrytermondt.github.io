window.onmessage = message => {
    if (message.source === lorenzIframe.contentWindow && message.data === 'ready') {
        setLorenz();
        lorenzObserver.observe(lorenzIframe);

        lorenzIframe.contentWindow.postMessage(width <= 1400 ? 'resize' : 'resize large');
    }
}

window.onresize = resize;

window.onload = () => {
    setBH();
    setS();
};