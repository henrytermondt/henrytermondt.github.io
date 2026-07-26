/*
    <div class='slide'>
        <div class='slide-image' style='background-image: url("/assets/campolindo-orchestra.avif"); background-position: bottom 0% left 0%;'></div>
        <div class='slide-text'>
            <div class='slide-title'>Assistant Concertmaster</div>
            <div class='slide-time'>2025-2026</div>
            <div class='slide-description'>
                Led the 1st violin section and orchestra of 50+ students
                when the concertmaster was absent. Worked to promote a
                collaborative atmosp-here and called attention to bullying.
            </div>
            <div class='slide-accent'></div>
        </div>
    </div>
    */

    /*
<div class='p-info-card shadow'>
    <div class='p-title'>Ray Tracing</div>
    <div class='p-description'>
        GPU-accelerated light modeling using industry standard techniques
    </div>
    <div class='p-accent'></div>
</div>
*/




const carousel = document.getElementById('carousel');
const createSlide = obj => {
    const container = document.createElement('div');
    container.className = 'slide';

    const img = document.createElement('div');
    img.classList = 'slide-image';
    container.appendChild(img);

    const text = document.createElement('div');
    text.className = 'slide-text';
    container.appendChild(text);



    const title = document.createElement('div');
    title.className = 'slide-title';
    title.textContent = obj.title;
    text.appendChild(title);

    const time = document.createElement('div');
    time.className = 'slide-time';
    time.textContent = obj.time;
    text.appendChild(time);

    const description = document.createElement('div');
    description.className = 'slide-description';
    description.innerHTML = obj.description;
    text.appendChild(description);

    const accent = document.createElement('div');
    accent.className = 'slide-accent';
    text.appendChild(accent);

    // Lazily loads the images when they are visible
    let loaded = false;
    ScrollTrigger.create({
        trigger: '#experience',
        start: 'top bottom',
        end: 'bottom top',
        onToggle: () => {
            if (!loaded) img.style.backgroundImage = `url(${obj.image})`;
            loaded = true;
        }
    });

    carousel.appendChild(container);
};


fetch('/assets/experience.json').then(result => {
    result.json().then(result => {
        for (const p of result) {
            createSlide(p);
            console.log(p);
        }
    }, () => console.log('Could not parse JSON')); // This should never happen
}, reason => {
    console.log('Could not fetch portfolio.json:', 'reason');
})