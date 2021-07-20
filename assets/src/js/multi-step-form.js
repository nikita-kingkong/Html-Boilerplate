//jQuery time
(function($) {

if ($('body.questionnaire-page').length || $('#questionaire-form').length) {

	// Check which CRM is used
	var form = '';
	if ($('form .infusion-field').length) {
		form = $('form .infusion-field')
	}
	else if ($('form fieldset').length) {
		form = $('form fieldset')
	}
	else if ($('form .form-group')) {
		form = $('form .form-group')
	}
	else if ($('form ._form_element').lemgth) {
		form = $('form ._form_element')
	}

	/* Make the outer wrapper the same height as the tallest field. */
	// Get an array of all element heights
	function setFormHeight() {
	
		$('form').css('height', ''); // reset
	
		var elementHeights = form.map(function () {
			return $(this).innerHeight();
		}).get();
	
		var maxHeight = Math.max.apply(null, elementHeights);
		// Set each height to the max height
		$('form').height(maxHeight);
	}
	
	var resizeTimerForms;
	$(window).on('resize load', function () {
		clearTimeout(resizeTimerForms);
		resizeTimerForms = setTimeout(function () {
			setFormHeight();
		});
	});

	$(window).on('load', function () {
	
		// multistep form code
		var current_fs, next_fs, previous_fs; //fieldsets
		var left, opacity, scale; //fieldset properties which we will animate
		var checkboxChecked, radioChecked, textInput;
	
		// With radio buttons, no need of next button
		$("form input[type=radio]").click(function() { 
			//Find nearest "next" button and activate it
			$(this).closest(form).find('input.next').click();
		});
	
		$(".next").click(function(){
			checkboxChecked = false;
			radioChecked = false;
			textInput = false;
			current_fs = $(this).parent();
			next_fs = $(this).parent().next();
	
			/* validation - if fails display an error message. */
			checkboxChecked = $(this).parent().find('input[type=checkbox]').is(":checked");
			radioChecked = $(this).parent().find('input[type=radio]').is(":checked");

			if ($(this).parent().find('input[type=text]').val() || $(this).parent().find('input[type=email]').val() || $(this).parent().find('input[type=tel]').val() || $(this).parent().find('textarea').val() || $(this).parent().find('select').val()) { 
				textInput = true 
			}
			
			if (checkboxChecked == false && radioChecked == false && textInput == false)
			{
				Swal.fire({
					title: "Something went wrong!",
					text: 'Please provide an answer to this question before moving on...',
					icon: 'error',
					showConfirmButton: false,
					timer: 5000,
				})
			}
			else {
				//activate next step on progressbar using the index of next_fs
				$("#progressbar li").eq($(form).index(next_fs)).addClass("active");
				next_fs.css('visibility','visible'); 
				
				//hide the current fieldset with style
				current_fs.animate({opacity: 0}, {
					step: function(now, mx) {
						//1. scale current_fs down to 80%
						scale = 1 - (1 - now) * 0.2;
						//2. bring next_fs from the right(50%)
						left = (now * 50)+"%";
						//3. increase opacity of next_fs to 1 as it moves in
						opacity = 1 - now;
						
						current_fs.css({
							'transform': 'scale('+scale+')', 
							'pointer-events': 'none',
						});
						next_fs.css({ 
							'left': left, 
							'opacity': opacity, 
							'pointer-events': 'all',
						});
					}, 
					duration: 1000,

					//this comes from the custom easing plugin
					easing: 'easeInOutBack'
				});
			}
	
		});
	
		$(".previous").click(function(){
			current_fs = $(this).parent();
			previous_fs = $(this).parent().prev();
			
			//de-activate current step on progressbar & show previous step
			$("#progressbar li").eq($(form).index(current_fs)).removeClass("active");
			next_fs.css('visibility', 'visible'); 

			//hide the current fieldset with style
			current_fs.animate({opacity: 0}, {
				step: function(now, mx) {
					//1. scale previous_fs from 80% to 100%
					scale = 0.8 + (1 - now) * 0.2;
					//2. take current_fs to the right(50%) - from 0%
					left = ((1-now) * 50)+"%";
					//3. increase opacity of previous_fs to 1 as it moves in
					opacity = 1 - now;
					
					current_fs.css({
						'left': left,
						'pointer-events': 'none',
					});
					previous_fs.css({
						'transform': 'scale('+scale+')', 
						'opacity': opacity,
						'pointer-events': 'all',
					});
				}, 
				duration: 1000, 
				
				//this comes from the custom easing plugin
				easing: 'easeInOutBack'
			});
		});
	
		$(".submit").click(function(){
			return false;
		})
	}); 
}



})( jQuery );