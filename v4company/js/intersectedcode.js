(function ($) {
    if (!navigator.userAgent.match(/(iPhone|iPod|iPad|Macintosh|Mac OS X)/i)) {
        if ($(window).width() < 768) {
            $(function () {
                const plugoo = document.querySelector('.page-home .site-main');
                const plugooHeight = plugoo.scrollHeight;
                const visibleHeight = plugooHeight * 0.35;

                plugoo.style.position = 'relative';
                plugoo.style.overflow = 'hidden';
                plugoo.style.height = `${visibleHeight}px`;

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            plugoo.style.overflow = 'auto';
                            plugoo.style.height = 'auto';
                            observer.disconnect();
                        }
                    });
                }, {
                    root: null,
                    rootMargin: '0px',
                    threshold: 1.0
                });
                const sentinel = document.createElement('div');
                sentinel.style.position = 'absolute';
                sentinel.style.bottom = '0';
                sentinel.style.width = '100%';
                sentinel.style.height = '1px';
                plugoo.appendChild(sentinel);
                observer.observe(sentinel);
            });
        }
    }
})(jQuery);
