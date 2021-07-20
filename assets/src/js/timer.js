(function($) {
    var deadlineHour = 2;   //hours
    var deadlineMinut = 30;     //minutes
    var deadlineSecond = 0;     //seconds

    $(window).on('load', function () {
        
        //COUNTDOWN
        if ($('.countdown-timer').length > 0) {
            function countdownTimer() {
                var remainingTime = calcRemainingTime(),
                    countHours = remainingTime['countHours'],
                    countMinuts = remainingTime['countMinuts'],
                    countSeconds = remainingTime['countSeconds'],
                    remainingCount = (countHours * 60 * 60) + (countMinuts * 60) + countSeconds,
                    deadlineCount = (deadlineHour * 60 * 60) + (deadlineMinut * 60) + deadlineSecond,
                    hourString = ' Hours, ',
                    minuteString = ' Minutes, ',
                    secondString = ' Seconds';

                if (countHours == 1) { hourString = ' Hour, ' }
                if (countMinuts == 1) { minuteString = ' Minute, ' }
                if (countSeconds == 1) { secondString = ' Second' }

                document.querySelectorAll(".training-text .time-left").forEach(function (selected, index) {
                    if (countHours < 1 && countMinuts < 1 ) {
                        selected.innerHTML = countSeconds + secondString;
                    } else if (countHours < 1 ) {
                        selected.innerHTML = countMinuts + minuteString + countSeconds + secondString;
                    } else {
                        selected.innerHTML = countHours + hourString + countMinuts + minuteString + countSeconds + secondString;
                    }
                });
                progress( remainingCount, deadlineCount);
            }
            setInterval(countdownTimer, 1000);
        }

        // FLIPCLOCK TIMER
        if ($('.flipclock-timer').length > 0) {
            var remainingTime = calcRemainingTime(),
                countHours = remainingTime['countHours'],
                countMinuts = remainingTime['countMinuts'],
                countSeconds = remainingTime['countSeconds'],
                deadline = new Date(Date.parse(new Date()) + (countHours * 60 * 60 * 1000) + (countMinuts * 60 * 1000) + (countSeconds * 1000));

            document.querySelectorAll('.flipclock-timer').forEach(function (selected, index) {
                var clock = new Clock(deadline, function(){ console.log('countdown complete') });
                selected.appendChild(clock.el);
            });
        }
    })

    function calcRemainingTime() {
        var dt = new Date();
        var startHour = dt.getHours();
        var startMinut = dt.getMinutes();
        var startSecond = dt.getSeconds();

        var countHours = startMinut ? (deadlineHour -1) - (startHour % deadlineHour) : deadlineHour - (startHour % deadlineHour);

        var countMinuts = startSecond ? (deadlineMinut -1) - (startMinut % deadlineMinut) : deadlineMinut - (startMinut % deadlineMinut);

        var countSeconds = startSecond ? 60 - startSecond : startSecond;

        return {
            'countHours': countHours,
            'countMinuts': countMinuts,
            'countSeconds': countSeconds
        };
    }

    function progress(timeleft, timetotal) {
        var progressBarWidth = 100 - ((timeleft / timetotal) * 100);
        $('.progressbar .completed').animate({ width: progressBarWidth + '%' }, 500);
    }

    // Flipclock Timer
    function CountdownTracker(label, value) {

        var el = document.createElement('span');
        el.className = 'flip-clock__piece';
        el.innerHTML = '<b class="flip-clock__card card"><b class="card__top"></b><b class="card__bottom"></b><b class="card__back"><b class="card__bottom"></b></b></b>' + 
            '<span class="flip-clock__slot">' + label + '</span>';
        this.el = el;

        var top = el.querySelector('.card__top'),
            bottom = el.querySelector('.card__bottom'),
            back = el.querySelector('.card__back'),
            backBottom = el.querySelector('.card__back .card__bottom');

        this.update = function(val){
            val = ( '0' + val ).slice(-2);
            if ( val !== this.currentValue ) {
                if ( this.currentValue >= 0 ) {
                    back.setAttribute('data-value', this.currentValue);
                    bottom.setAttribute('data-value', this.currentValue);
                }
                this.currentValue = val;
                top.innerText = this.currentValue;
                backBottom.setAttribute('data-value', this.currentValue);

                this.el.classList.remove('flip');
                void this.el.offsetWidth;
                this.el.classList.add('flip');
            }
        }
        this.update(value);
    }

    // Calculation adapted from https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/

    function getTimeRemaining(endtime) {
        var t = Date.parse(endtime) - Date.parse(new Date());
        return {
            'Total': t,
            // 'Days': Math.floor(t / (1000 * 60 * 60 * 24)),
            'Hours': Math.floor((t / (1000 * 60 * 60)) % 24),
            'Minutes': Math.floor((t / 1000 / 60) % 60),
            'Seconds': Math.floor((t / 1000) % 60)
        };
    }

    function getTime() {
        var t = new Date();
        return {
            'Total': t,
            'Hours': t.getHours() % 12,
            'Minutes': t.getMinutes(),
            'Seconds': t.getSeconds()
        };
    }

    function Clock(countdown, callback) {
    
        countdown = countdown ? new Date(Date.parse(countdown)) : false;
        callback = callback || function(){};
        
        var updateFn = countdown ? getTimeRemaining : getTime;

        this.el = document.createElement('div');
        this.el.className = 'flip-clock';

        var trackers = {},
            t = updateFn(countdown),
            key, timeinterval;

        for ( key in t ){
            if ( key === 'Total' ) { continue; }
            trackers[key] = new CountdownTracker(key, t[key]);
            this.el.appendChild(trackers[key].el);
        }

        var i = 0;
        function updateClock() {
            timeinterval = requestAnimationFrame(updateClock);
            
            // throttle so it's not constantly updating the time.
            if ( i++ % 10 ) { return; }
            
            var t = updateFn(countdown);
            if ( t.Total < 0 ) {
                cancelAnimationFrame(timeinterval);
                for ( key in trackers ){
                    trackers[key].update( 0 );
                }
                callback();
                return;
            }
            
            for ( key in trackers ){
                trackers[key].update( t[key] );
            }
        }
        setTimeout(updateClock,500);
    }
    
})( jQuery );