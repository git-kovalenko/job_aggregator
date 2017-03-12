$(document).ready(function(){
	currency_init();
	main_slider.init();
	brand_slider = new Cyclic_slider($('.brands > ul'));
	latest_prod = new Cyclic_slider( $('.latest_products > ul') );
		
})


function currency_init(){
	var dropdown_currency = document.getElementById('currency');
	dropdown_currency.selectedIndex = 0;
	dropdown_currency.onchange = currency_change;
}
	
function currency_change(){ 
	var currency = document.getElementById('currency').value;
	switch (currency) {
		case 'dollars':
			$(".price li:first-child").html("$");
			change_rate(1.15);  //this is an example. In real project price takes from MySQL.
			break
		case 'euro':
			$(".price li:first-child").text("€"); //€ -> Alt+0128
			change_rate(0.87);	//this is an example. In real project price takes from MySQL.			
			break
	}
	$(".price li:first-child").append('<div class="shine"></div>');
	
	function change_rate(rate){
		$.each($(".price"), function(){
			var a = this.textContent;
			a = rate * parseInt(a.replace(/[^0-9]/gm, ''),  10);
			a = a.toFixed(); 
			var n = this.children.length;
			for (var i = 1; i<n; i++){
				this.children[i].textContent = a.toString().slice(i-1, i);
			}
		});
	}
}

var main_slider = {
	slides:['slide_1.jpg','slide_2.jpg','slide_3.jpg','slide_4.jpg','slide_5.jpg'],
	frame:0, 
	set: function(frame) { 
		$("#slider > ul li:visible").hide();
		$('#slider > ul li:eq('+frame+')').show();
		var ruler = $('#slide_ruler > ul li');
		for (var i = 0; i < 5; i++){
			ruler[i].style.backgroundColor = '';
		}
		ruler[frame].style.backgroundColor = 'white';
	},
	init: function() { 
		var slider_list = document.querySelector("#slider > ul");
		while (slider_list.firstChild){
			slider_list.removeChild(slider_list.firstChild);			
		}
		for (var i = 0; i<5; i++){
			$(slider_list).append('<li><img src="images/'+this.slides[i]+'" alt="Slide '+(i+1)+'"></li>');
		}
		this.set(this.frame);
		$('#slide_ruler > ul').click( function(e){ 
			var target = e.target;
			main_slider.set($(target).index());
			main_slider.frame = $(target).index();
		});
		main_slider_interval = setInterval(function() { 
			main_slider.right();
		},2000);
		$('#slider').mouseenter(function(){
			clearInterval(main_slider_interval);
		});
		$('#slider').mouseleave(function(){
			main_slider_interval = setInterval(function() { 
				main_slider.right();
			},2000);
		});
	},
	left: function() { 
		this.frame--;
		if(this.frame < 0) this.frame = this.slides.length-1;
		this.set(this.frame);
	},
	right: function() { 
		this.frame++;
		if(this.frame == this.slides.length) this.frame = 0;
		this.set(this.frame);		
	}
};

function Cyclic_slider(wrapper){
	this.wrapper = wrapper;
	this.slide_1 = $(this.wrapper).children(':first-child');
	this.next_link = $(this.wrapper).prev('img');
	this.prev_link = $(this.wrapper).next('img');
	
	var init_margin_px = this.slide_1.css("marginRight");  
	init_margin_px = parseFloat(init_margin_px);
	var wrapper_width_px = this.wrapper.width();
	var init_margin = 100 * (init_margin_px / wrapper_width_px) +'%';
	
	var scroll_width_px = this.slide_1.outerWidth();
	var scroll_width = 100 * ((scroll_width_px + init_margin_px) / wrapper_width_px) +'%';
	
	this.init_margin = init_margin;
	this.scroll_width = scroll_width;
	this.animation_time = 400;
	
	this.next_link[0].addEventListener('click',function(){
		this.next();
	}.bind(this), false);
	this.prev_link[0].addEventListener('click',function(){
		this.previous();
	}.bind(this), false);
	
	window.addEventListener('resize', function(){
		this.resize();
	}.bind(this));

}

Cyclic_slider.prototype.resize = function(){
	var init_margin_px = this.slide_1.css("marginRight");  
	init_margin_px = parseFloat(init_margin_px);
	var wrapper_width_px = this.wrapper.width();
	var init_margin = 100 * (init_margin_px / wrapper_width_px) +'%';
	
	var scroll_width_px = this.slide_1.outerWidth();
	var scroll_width = 100 * ((scroll_width_px + init_margin_px) / wrapper_width_px) +'%';
	
	this.init_margin = init_margin;
	this.scroll_width = scroll_width;
}	

Cyclic_slider.prototype.next = function(){
	if( ! this.slide_1.is(':animated')) {
		var last_slide = $(this.wrapper).children(':last-child');
		last_slide.css({margin: '0 '+ this.init_margin +' 0 -' + this.scroll_width});
		last_slide.insertBefore(this.slide_1);
		this.slide_1 = $(this.wrapper).children(':first-child');
		this.slide_1.animate({margin: '0 '+ this.init_margin +'% 0 0'}, this.animation_time);
	}
}

Cyclic_slider.prototype.previous = function(){
	if( ! this.slide_1.is(':animated')) {
		$(this.wrapper).children(':last-child').css({display: 'list-item'});
		this.slide_1.animate({margin: '0 '+ this.init_margin +' 0 -'+ this.scroll_width}, this.animation_time, function(){
			$(this.slide_1).remove()
			.css({margin: '0 '+ this.init_margin +' 0 0'})
			.insertAfter($(this.wrapper).children(':last-child'));
			this.slide_1 = $(this.wrapper).children(':first-child');
		}.bind(this));
	}
}

Cyclic_slider.prototype.previous = function(){
	if( ! this.slide_1.is(':animated')) {
		$(this.wrapper).children(':last-child').show(); //css({display: 'inline-flex'});
		this.slide_1.animate({margin: '0 '+ this.init_margin +' 0 -'+ this.scroll_width}, this.animation_time, function(){
			$(this.slide_1).remove()
			.css({margin: '0 '+ this.init_margin +' 0 0'})
			.insertAfter($(this.wrapper).children(':last-child'));
			this.slide_1 = $(this.wrapper).children(':first-child');
		}.bind(this));
	}
}
	




