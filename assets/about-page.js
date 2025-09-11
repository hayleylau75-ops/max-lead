// ===== UNIFIED ABOUT PAGE JAVASCRIPT =====

// Vue.js for About Page
var product = new Vue({
    delimiters: ['[[', ']]'],
    el: '#about1',
    data() {
        return {
            swiperIndex: 0,
            swiper: null
        }
    },
    mounted() {
        // 等待所有资源加载完成
        this.$nextTick(() => {
            this.waitForSwiper()
        })
    },
    methods: {
        waitForSwiper() {
            // 确保 Swiper 库已加载
            if (typeof Swiper !== 'undefined') {
                console.log('Swiper library found, initializing...')
                this.initSwiper()
            } else {
                // 如果 Swiper 未加载，等待一段时间后重试
                console.log('Swiper library not found, retrying...')
                setTimeout(() => {
                    this.waitForSwiper()
                }, 100)
            }
        },
        initSwiper() {
            // 确保之前的swiper实例被销毁
            if (this.swiper) {
                this.swiper.destroy(true, true)
            }

            console.log('Initializing Swiper...')
            const that = this
            this.swiper = new Swiper('.swiper-container', {
                // 基本配置
                initialSlide: 0,
                slidesPerView: 1,
                spaceBetween: 0,
                centeredSlides: false,
                loop: false,
                allowTouchMove: true,

                // 导航按钮
                navigation: {
                    nextEl: '.next-btn',
                    prevEl: '.prev-btn',
                },

                // 自动观察DOM变化
                observer: true,
                observeParents: true,
                observeSlideChildren: true,

                // 事件处理
                on: {
                    init: function () {
                        console.log('Swiper initialized, active index:', this.activeIndex)
                        that.swiperIndex = this.activeIndex
                        that.updateTimeline()
                    },
                    slideChange: function () {
                        console.log('Slide changed to index:', this.activeIndex)
                        that.swiperIndex = this.activeIndex
                        that.updateTimeline()
                    },
                    resize: function () {
                        this.update()
                    }
                }
            })
        },
        updateTimeline() {
            // 获取当前活动幻灯片的内容
            const activeSlide = document.querySelector('.swiper-slide-active')
            if (activeSlide) {
                const slideTitle = activeSlide.querySelector('.photo_con_title')
                const slideDesc = activeSlide.querySelector('.photo_con_desc_title')

                // 更新时间轴显示
                const timelineElement = document.querySelector('.about1_play_con_tm h1')
                if (timelineElement && slideTitle) {
                    timelineElement.textContent = slideTitle.textContent
                }
            }
        },
        handleClick(event, data) {
            switch (event) {
                case 'aboutActive': {
                    this.aboutActive = data.index
                    break
                }
                case 'zhedieIndex': {
                    if (this.zhedieIndex === data) {
                        this.zhedieIndex = null
                        return
                    }
                    this.zhedieIndex = data
                    break

                }
            }
        }
    }
})

// Vue.js for Keeps Section
var keeps = new Vue({
    delimiters: ['[[', ']]'],
    el: '#keeps',
    data() {
        return {
            keepsData: [
                {
                    icon: 'https://cdn.shopify.com/s/files/1/0241/6646/5591/files/icon1_1ae56917-1ab4-4b9f-bfd7-701540f32a01.png?v=1653377242',
                    title: ' Our Values ',
                    desc: 'Sincerity, Equality, Gratitude, Sustainability'
                },
                {
                    icon: 'https://cdn.shopify.com/s/files/1/0241/6646/5591/files/icon2_d95373f4-95dd-406e-8944-2fac5670343b.png?v=1653377242',
                    title: ' Our Philosophy ',
                    desc: 'Every product embodies our belief that daily life should feel effortless, spaces should inspire possibility, and quality craftsmanship creates lasting value. '
                },
                {
                    icon: 'https://cdn.shopify.com/s/files/1/0241/6646/5591/files/icon3_9d95d716-d5a0-4e92-bc0b-b75df671d40b.png?v=1653377242',
                    title: ' Our Purpose ',
                    desc: 'We orchestrate whole-home harmony — where indoor comfort blends with outdoor adventure, play nurtures growth, and every space renews your rhythm of living. '
                },
                {
                    icon: 'https://cdn.shopify.com/s/files/1/0241/6646/5591/files/icon4_947d4b03-b8f9-4de9-9a36-922dc9c7bf2e.png?v=1653377242',
                    title: ' Our Vision ',
                    desc: 'Your premier destination for quality home, outdoor, gardening, and sports & recreation products – transforming spaces, elevating experiences.To be the preferred trustworthy brand in recreational sports and leisure activities.'
                }
            ]
        }
    }
})

// Counter Animation for Facts Section
function animateCounters() {
    const counters = document.querySelectorAll('.meeting-card-title');

    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        const increment = target / 100;
        let current = 0;

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + '+';
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target + '+';
            }
        };

        updateCounter();
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('meeting-cards')) {
                animateCounters();
            }
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function () {
    const animateElements = document.querySelectorAll('.meeting-cards, .brand-item, .item');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Responsive image loading
function loadResponsiveImages() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    loadResponsiveImages();

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('.brand-item, .meeting-card, .bbtn');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });

        el.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Handle window resize
window.addEventListener('resize', function () {
    // Reinitialize swiper on resize
    if (product && product.swiper) {
        product.swiper.update();
    }
});

// Performance optimization: Debounce resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedResize = debounce(function () {
    if (product && product.swiper) {
        product.swiper.update();
    }
}, 250);

window.addEventListener('resize', debouncedResize); 