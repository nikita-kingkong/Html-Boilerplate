(function($) {
    $(window).on('load', function () {

        // Components loading animations
        $('.view-animation').viewportChecker({
            classToAdd: 'animated',
            offset: 80
        });

        // Accordion for FAQs (jQuery)
        $('.accordion dt.active').next().slideDown()

        $('.accordion').on('click', 'dt', function () {
            $('.accordion dd').slideUp();

            if (!$(this).hasClass('active')) {
                // remove active class from any others that might be active
                $('.accordion dt.active').removeClass('active');
                $(this).addClass('active');
                $(this).next().slideDown();
            } else {
                $(this).removeClass('active');
            }
        });

        // Phone Concatenation Script For Tracking
        setTimeout(function () {
            $('.phone-text em').each(function () {
                var unsliced = $(this).text();
                var sliced = unsliced.slice(0, -2) + "...";
                $(this).text(sliced);
                var linked = "tel:" + unsliced.replace(/\s/g, '');
                $(this).click(function () {
                    if ($(window).width() < 1000) {
                        window.location.href = linked;
                    } else {
                        $(this).text(unsliced);
                    }
                });
            });

        }, 2000)

       // get all sliders, we need to loop them due to different settings + nav
        var swipers = document.querySelectorAll('.swiper-container:not(.control):not(.mobile)');
        swipers.forEach(function(el,index){
            var closestSection = el.closest('section');
            var controls = closestSection.querySelector('.control');

            // slider settings
            var options = {
                speed: 600,
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                thumbs:{},
            };

            // For gallery sliders
            if(controls){
                options.thumbs.swiper = new Swiper(controls, {
                    speed: 600,
                    loop: true,
                    slidesPerView: 4,
                    spaceBetween: 10,
                    freeMode: true,
                    centeredSlides: true,
                    watchSlidesVisibility: true,
                    watchSlidesProgress: true,
                    autoplay: {
                        delay: 5000,
                        disableOnInteraction: true,
                    },
                    breakpoints: {
                        320: {
                            slidesPerView: 2
                        },
                        480: {
                            slidesPerView: 3
                        },
                        640: {
                            slidesPerView: 4
                        }
                    }
                });
            }

            // init slider
            new Swiper(el, options);
        });
    })

    // mobile sliders, like logo rows etc
    // need to loop in order to get the slide count
    var resizeTimer, mobileSwiperSlider = [], mobileSwiperCount;
    $(window).on('resize load', function () {
        clearTimeout(resizeTimer);
        mobileSwiperSlider.forEach( function(slider, index) {
            if (typeof(slider) !== "undefined" ) {
                slider.destroy();
            }
        });

        resizeTimer = setTimeout(function () {
            
            mobileSwiperCount = 0;
            var mobileSwipers = document.querySelectorAll('.swiper-container.mobile');

            mobileSwipers.forEach(function(el,index){
                
                var slideCount = el.querySelectorAll('.swiper-slide').length;
    
                var options = {
                    speed:600,
                    slidesPerView: 1,
                    watchOverflow: true,
                    loop: true,
                    simulateTouch: false,
                    autoplay: {
                        delay: 5000,
                        disableOnInteraction: true,
                    },
                    pagination:{
                        el: '.swiper-pagination',
                        type: 'bullets',
                        clickable: true
                    },
                    breakpoints: {
                        576 : {
                            slidesPerView: 2
                        },
                        768 : {
                            slidesPerView: 4
                        },
                        992: {
                            slidesPerView: slideCount,
                            loop: false,
                        }
                    }
                };
    
                // init slider
                mobileSwiperSlider[mobileSwiperCount] = new Swiper(el, options);
                mobileSwiperCount++;
            });
        }, 500);
    })

    // Sticky Header
    $(window).on("scroll load", function () {
        if ($(window).scrollTop() >= 50) {
            $('header').addClass('scrolled');
        } else {
            $('header').removeClass('scrolled');
        }
    });

    // Smooth Scroll To Anchor
    $(document).on('click', 'a[href*="#"]', function (event) {
        event.preventDefault()
        var target = $(this).attr('href')

        if ($(target).length) {
            $('html, body').animate({
                scrollTop: $(target).offset().top - 80
            }, 1500)
        }
    });

    // Inline Video Funcionality
    $(document).on('click', '.inline-video-trigger', function () {
        if ($(this).data('video-id')) {
            if ($(this).hasClass('vimeo')) {
                var iframeHTML = '<iframe src="https://player.vimeo.com/video/' + $(this).attr('data-video-id') + '?title=0&byline=0&portrait=0?&autoplay=1" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>';
            } else {
                var iframeHTML = '<iframe src="https://www.youtube.com/embed/' + $(this).attr('data-video-id') + '?autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
            }

            $(this).parent('.video-preview-container').find('.inline-video-trigger').hide();
            $(this).parent('.video-preview-container').find('.overlay').hide();
            $(this).parent('.video-preview-container').find('iframe').remove();
            $(this).parent('.video-preview-container').append(iframeHTML);
        } else {
            console.error('no video ID provided.');
        }
    });

})( jQuery );

// Get Current Month Name
function getCurrentMonth() {
    var months    = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var now       = new Date();
    var thisMonth = months[now.getMonth()]; // getMonth method returns the month of the date (0-January :: 11-December)
    var output = document.getElementsByClassName('output');

    $( ".output" ).html( thisMonth);
}
getCurrentMonth();