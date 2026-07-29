window.onmessage = message => {
    if (message.source === lorenzIframe.contentWindow && message.data === 'ready') {
        setLorenz();
        lorenzObserver.observe(lorenzIframe);
    }
}

window.onresize = resize;

window.onload = () => {
    setBH();
    setS();
};