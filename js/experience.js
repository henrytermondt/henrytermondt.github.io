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
        }
    }, () => console.log('Could not parse JSON')); // This should never happen
}, reason => {
    console.log('Could not fetch portfolio.json:', 'reason');
})


// Button logic
const fullSlideWidth = 350 + 100 + 20;
const slideLeft = () => {
    carousel.scrollBy({
        left: -fullSlideWidth,
        behavior: 'smooth',
    });
};
const slideRight = () => {
    carousel.scrollBy({
        left: fullSlideWidth,
        behavior: 'smooth',
    });
};


// let slidePosition = 0;
// const fullSlideWidth = 350 + 100 + 20;
// let scrollActive = false;
// let pleft = 0;
// carousel.onwheel = (e) => {
//     scrollActive = Math.abs(carousel.scrollLeft - pleft) >= 2; // This seems very implementation dependent... (warning to self)
//     pleft = carousel.scrollLeft;

//     if (scrollActive) {
//         carousel.scrollTo({
//             top: carousel.scrollTop,
//             left: carousel.scrollLeft,
//             behavior: 'instant'
//         });
//     }
// };
// carousel.onscrollend = () => {
//     window.requestAnimationFrame(() => {
//         if (scrollActive) return;

//         slidePosition = Math.round(carousel.scrollLeft / fullSlideWidth);

//         // Handles the literal edge case, haha
//         if (Math.ceil(carousel.scrollLeft / fullSlideWidth) + 1 >= carousel.scrollWidth / fullSlideWidth) {
//             slidePosition = carousel.scrollLeft / fullSlideWidth;
//         }
        
//         const result = carousel.scrollTo({
//             left: slidePosition * fullSlideWidth,
//             behavior: 'smooth',
//         });
//     });
// };


// const slideLeft = () => {
//     // If not an integer, go to integer
//     if (slidePosition - (slidePosition | 0) > 0.0001) slidePosition = (slidePosition | 0) + 1
//     else slidePosition --; // Otherwise, decrement
    
//     let result = carousel.scrollTo({
//         left: slidePosition * fullSlideWidth,
//         behavior: 'smooth',
//     });

//     if (slidePosition < 0) {
//         slidePosition = 0;
//     }
// };
// const slideRight = () => {
//     slidePosition ++;
//     if (slidePosition >= carousel.scrollWidth / fullSlideWidth) {
//         slidePosition = carousel.scrollWidth / fullSlideWidth + 1;
//     }
//     carousel.scrollTo({
//         left: slidePosition * fullSlideWidth,
//         behavior: 'smooth',
//     });
//     console.log(slidePosition, carousel.scrollWidth / fullSlideWidth);
    
// };




