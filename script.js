// ✅ Canvas background code (runs immediately)
const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];

canvas.style.position = 'fixed';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.zIndex = '-2';
canvas.style.pointerEvents = 'none';

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--primary-color');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles(num = 80) {
    particlesArray = [];
    for (let i = 0; i < num; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();


// ✅ Everything else inside DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIndicator = document.querySelector('.theme-indicator');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        themeIndicator.textContent = savedTheme.charAt(0).toUpperCase() + savedTheme.slice(1);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeIndicator.textContent = newTheme.charAt(0).toUpperCase() + newTheme.slice(1);
        });
    }

    const copyLinks = document.querySelectorAll('.copy-link');
    copyLinks.forEach(link => {
        if (!link.querySelector('.copy-tooltip')) {
            const tooltip = document.createElement('span');
            tooltip.className = 'copy-tooltip';
            tooltip.textContent = 'Copy';
            link.appendChild(tooltip);
        }

        link.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = link.getAttribute('data-copy');
            const tooltip = link.querySelector('.copy-tooltip');

            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    tooltip.textContent = 'Copied!';
                    link.classList.add('copied');
                    setTimeout(() => {
                        tooltip.textContent = 'Copy';
                        link.classList.remove('copied');
                    }, 2000);
                })
                .catch(err => {
                    console.error('Could not copy text: ', err);
                    tooltip.textContent = 'Failed';
                    link.classList.add('copied');
                    setTimeout(() => {
                        tooltip.textContent = 'Copy';
                        link.classList.remove('copied');
                    }, 2000);
                });
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (!this.classList.contains('copy-link')) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'var(--navbar-background)';
                navbar.style.boxShadow = '0 4px 30px var(--shadow-color)';
                navbar.style.border = '1px solid var(--border-color)';
            } else {
                navbar.style.background = 'transparent';
                navbar.style.boxShadow = 'none';
                navbar.style.border = 'none';
            }
        });
    }

    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });
});
