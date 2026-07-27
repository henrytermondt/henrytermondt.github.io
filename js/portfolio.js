const infoCardWrapper = document.getElementById('p-info-card-wrapper'),
    thumbnailWrapper = document.getElementById('p-display-wrapper'),
    thumbnailEl = document.getElementById('p-display');
let firstImg, firstContainer;
const createInfoCard = (obj, first) => {
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

    if (first) {
        firstContainer = container;
        firstImg = img;
        img.style.display = 'block';
        img.style.opacity = 1;

        container.style.transform = 'translate(15px, 0)';
    }

    container.onmouseenter = e => {
        firstContainer.removeAttribute('style');
        if (img !== firstImg) {
            gsap.to(firstImg, {
                y: 5,
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    firstImg.style.display = 'none';
                }
            });
        }

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
        for (let i = 0; i < result.length; i ++) {
            createInfoCard(result[i], i === 0);
        }
    }, () => console.error('Could not parse JSON')); // This should never happen
}, reason => {
    console.error('Could not fetch portfolio.json:', 'reason');
})