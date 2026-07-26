/*
<div class='p-info-card shadow'>
    <div class='p-title'>Ray Tracing</div>
    <div class='p-description'>
        GPU-accelerated light modeling using industry standard techniques
    </div>
    <div class='p-accent'></div>
</div>
*/




const infoCardWrapper = document.getElementById('p-info-card-wrapper'),
    thumbnailWrapper = document.getElementById('p-display-wrapper'),
    thumbnailEl = document.getElementById('p-display');
const createInfoCard = obj => {
    const container = document.createElement('div');
    container.classList = 'p-info-card shadow';

    const title = document.createElement('div');
    title.className = 'p-title';
    title.textContent = obj.title;
    container.appendChild(title);

    const description = document.createElement('div');
    description.className = 'p-description';
    description.textContent = obj.description;
    container.appendChild(description);

    const accent = document.createElement('div');
    accent.className = 'p-accent';
    container.appendChild(accent);

    // Fade into view when the user hovers
    const img = document.createElement('img');
    img.classList = 'p-display shadow';
    thumbnailWrapper.appendChild(img);

    container.onmouseenter = e => {
        img.style.display = 'block';
        gsap.to(img, {
            y: 0,
            opacity: 1,
            duration: 0.1,
        });
    };
    container.onmouseleave = e => {
        gsap.to(img, {
            y: 5,
            opacity: 0,
            duration: 0.1,
            onComplete: () => {
                img.style.display = 'none';
            }
        });
    };

    // Lazily loads the images when they are visible
    let loaded = false;
    // const img = new Image();
    ScrollTrigger.create({
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: () => {
            if (!loaded) img.src = obj.image;
            loaded = true;
        }
    });

    infoCardWrapper.appendChild(container);
};


fetch('/assets/portfolio.json').then(result => {
    result.json().then(result => {
        for (const p of result) {
            createInfoCard(p);
        }
    }, () => console.error('Could not parse JSON')); // This should never happen
}, reason => {
    console.error('Could not fetch portfolio.json:', 'reason');
})