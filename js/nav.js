let navDown = false;
window.addEventListener('wheel', e => {
    if (fullNavOpen) return;

    if (e.deltaY > 0 && navDown || window.scrollY < 200) {
        navDown = false;
        gsap.to('nav', {
            y: -48,
            duration: 0.1,
        });
    } else if (e.deltaY < 0 && !navDown) {
        navDown = true;
        gsap.to('nav', {
            y: 0,
            duration: 0.1,
        });
    }
});


let fullNavOpen = false;
const heroHamburger = document.querySelector('#hero-nav .hamburger-menu'); // Haha
const openNav = () => {
    fullNavOpen = true;

    gsap.set('nav', {y: 0});

    document.body.classList.add('no-scroll');

    heroHamburger.style.display = 'none';

    gsap.to('#full-nav', {
        x: 0,
        duration: 0.3,
    });

    gsap.to('nav .hamburger-menu', {
        x: -50,
        opacity: 0,
        duration: 0.3,
    });
    gsap.to('nav .x', {
        x: 0,
        duration: 0.3,
    });
};
const closeNav = () => {
    fullNavOpen = false;
    heroHamburger.style.display = 'block';

    gsap.to('#full-nav', {
        x: '101vw',
        duration: 0.1,
    });

    gsap.to('nav', {
        y: -48,
        duration: 0.1,
    });

    gsap.set('nav .hamburger-menu', {
        x: 0,
        opacity: 1,
        delay: 0.5,
    });
    gsap.set('nav .x', {
        x: 50,
        delay: 0.5,
    });

    document.body.classList.remove('no-scroll');
};

const navTL = gsap.timeline({
    scrollTrigger: {
        trigger: document.getElementById('selected-works'),
        start: 'top top',
        end: 'bottom top',
        toggleActions: 'restart reverse restart reverse',
    },
    ease: 'none',
    duration: 0.3,
});

navTL.to('nav, #full-nav', {
    backgroundColor: 'rgb(0, 0, 0, 0.7)',
}, 0);
navTL.to('nav .nav-link, #full-nav .nav-link', {
    color: 'rgb(255, 255, 255)',
}, 0);
navTL.to('nav img', {
    filter: 'invert(100%)',
}, 0);
navTL.to('nav', {
    borderColor: 'rgb(55, 55, 55)',
}, 0);

