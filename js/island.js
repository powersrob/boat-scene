 

// ************************************************************************************************
// global variables
// ************************************************************************************************

var screenWidth = $(window).width();
var screenHeight = $(window).height();

var nightTime = false;
var raining = true;
var windDirection = "east";
var windSpeed = 10;

var bgs_island = $("#island").bgswitcher({
  images: ["img/island-day.png", "img/island-night.png"],
  start: false
});
var bgs_bgisland1 = $("#bgisland1").bgswitcher({
  images: ["img/bgisland1-day.png", "img/bgisland1-night.png"],
  start: false
});
var bgs_bgisland2 = $("#bgisland2").bgswitcher({
  images: ["img/bgisland2-day.png", "img/bgisland2-night.png"],
  start: false
});
var bgs_sky = $("#sky").bgswitcher({
  images: ["img/sky-day.png", "img/sky-night.png"],
  start: false
});
var bgs_water = $("#water").bgswitcher({
  images: ["img/water-day.png", "img/water-night.png"],
  start: false
});



// ************************************************************************************************
// initialize
// ************************************************************************************************

$( document ).ready(function() {
    $('body').css('width',screenWidth);
    $('body').css('height',screenHeight);
    updateInputUI();
    checkRain();
    checkNightTime();
    clouds();
    // preloadImage('/ref/img/rain/rain-cloud.png', '.rain-cloud');
});




// ************************************************************************************************
// User Inputs
// ************************************************************************************************

$(".controlSwitch").click(function() {
	toggleControls(); 
	togglePlusMinus(this);
});	

//Night/Day button pressed
$('input[type=radio][name=timeofday]').change(function() {
    if (this.value == 'day') {
        turnToDay();
    }
    else if (this.value == 'night') {
        turnToNight();
    }
});

//Wind direction button pressed
$('input[type=radio][name=winddirection]').change(function() {
    if (this.value == 'west') {
        windDirection = "west";
    }
    else if (this.value == 'east') {
        windDirection = "east";
    }
    checkRain();
});

//Wind Direction Speed button pressed
$('input[type=radio][name=windSpeedRadio]').change(function() {
 	windSpeed = this.value;
 	checkRain();
});

//Raining button pressed
$('input[name=raining]').change(function() {
    if (this.value == 'true') {
        raining = true;
    } else {
        raining = false;
    }
    checkRain();
});




// ************************************************************************************************
// Utilities
// ************************************************************************************************



function randomNum(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}
function randomDec(min, max) {
  return Math.random() * (max - min) + min;
}
 
function preloadImage(source, destElem) {
    var image = new Image();
    image.src = source;
    image.onload = function () {
        var cssBackground = 'url(' + image.src + ')';

        $(destElem).css('background-image', cssBackground);
    };
}

function userDataCallBack (argument) {
    $("#city").html(globalCity);
    $("#temperature").html(globaltemperature);
    $("#windspeed").html(globalwindspeed);
    $("#winddirection").html(globalwindsdirection);
    $("#sunset").html(globalsunset);
    $("#sunrise").html(globalsunrise);
    $("#precipitation").html(globalprecipitation);

  }





// ************************************************************************************************
// User Interface Functions
// ************************************************************************************************

function toggleControls() {
	$( "#controls" ).toggleClass( "active" );
	$( "#subcontrols" ).fadeToggle( "fast", "linear" );
}

function togglePlusMinus(t){
	$(t).toggleClass('fa-plus-circle');
	$(t).toggleClass('fa-minus-circle');
}


function updateInputUI() {
	// day/night inpput
	if (nightTime) { 
		$('input[type=radio][value=night]').prop("checked", true);
	} else {
		$('input[type=radio][value=day]').prop("checked", true);
	}	

	if (raining) { 
		$('input[name=raining][value=true]').prop("checked", true);
	} else {
		$('input[name=raining][value=false]').prop("checked", true);
	}	

	//
    if (windDirection == 'east') {
		$('input[type=radio][value=east]').prop("checked", true);
		$('input[type=radio][value=west]').checked = false;
    } else if  (windDirection == 'west') {
		$('input[type=radio][value=east]').checked = false;
		$('input[type=radio][value=west]').prop("checked", true);
	}

	if (windSpeed == 100) {
		$('input[type=radio][value=100]').prop("checked", true);
	} else if (windSpeed == 10) {
		$('input[type=radio][value=10]').prop("checked", true);
	} else if (windSpeed == 1) {
		$('input[type=radio][value=1]').prop("checked", true);
	} else if (windSpeed == 0) {
		$('input[type=radio][value=0]').prop("checked", true);
	}

}




// ************************************************************************************************
// Check States
// ************************************************************************************************

function checkRain() {
	$(".rain").stop();
	$(".rain").remove();

	if (raining) {
		$("html").addClass("raining");
		$("body").append("<div class='rain'></div>")
		rain();
	} else {
		$("html").removeClass("raining");
	}

	clouds();

}

function checkNightTime() {

	if (nightTime) {
		$("html").addClass("night");		
		$('#nightSky').css('top','-128px');

		bgs_island.bgswitcher("select", 1);
		bgs_bgisland1.bgswitcher("select", 1);		
		bgs_bgisland2.bgswitcher("select", 1);		
		bgs_sky.bgswitcher("select", 1);		
		bgs_water.bgswitcher("select", 1);	

	} else {
		$("html").addClass("day");		
		$('#daySky').css('top','-128px');	
	}

}






// ************************************************************************************************
// Animation Transistinos
// ************************************************************************************************

function turnToDay (argument) {
	nightTime = false;

	$("html").addClass("day")
	$("html").removeClass("night")

	bgs_island.bgswitcher("select", 0);
	bgs_bgisland1.bgswitcher("select", 0);
	bgs_bgisland2.bgswitcher("select", 0);	
	bgs_sky.bgswitcher("select", 0);
	bgs_water.bgswitcher("select", 0);


	//night pans down, then resets
	$( "#nightSky" ).animate({
    	top: "+=512"
		}, {
		duration: 1000,
    	specialEasing: {
      		top: "easeInOutQuart"
    	},
    	complete: function() {
    		$('#nightSky').css('top','-512px');
    	}	
  	});

 	//wait 1s then day pans down.
	setTimeout(function(){
		$( "#daySky" ).animate({
	    	top: "+=384"
			}, {
			duration: 1000,
	    	specialEasing: {
	      		top: "easeOutBack"
	    	}
	  	});

	}, 1000);

}

function turnToNight (argument) {
	nightTime = true;

	$("html").addClass("night")
	$("html").removeClass("day")

	bgs_island.bgswitcher("select", 1);
	bgs_bgisland1.bgswitcher("select", 1);
	bgs_bgisland2.bgswitcher("select", 1);	
	bgs_sky.bgswitcher("select", 1);
	bgs_water.bgswitcher("select", 1);


	$( "#daySky" ).animate({
    	top: "+=512"
		}, {
		duration: 1000,
    	specialEasing: {
      		top: "easeInOutQuart"
    	},
    	complete: function() {
    		$('#daySky').css('top','-512px');

    	}	

  	});


	setTimeout(function(){
		//$('#moon').css('top','-280px');
		$( "#nightSky" ).animate({
	    	top: "+=384"
			}, {
			duration: 1000,
	    	specialEasing: {
	      		top: "easeOutBack"
	    	}
	  	});

	}, 1000);

}

 

function getStarColor() {
    var x=Math.floor((Math.random()*2));
    var color = starColorSelections(x);
    return color;
}
function starColorSelections(x) {
    var colors = ["#5E85BC","white"];
    return colors[x];
}

function stars() {
	var stars = "";
	for (i =0; i < 512; i++) { 

		//<i class='stars starX' style='top: X; left: X;'></i>
		var x = randomDec(0,100);
		var y = randomNum(0,512);
		var b = getStarColor();
		stars = stars + "<i class='stars' style='top:" + y + "px; left: " +x+ "%; background-color: " +b+"'></i>";
	}
	document.getElementById("starField").innerHTML = stars;
}
stars();	

function shootingStars () {
	var shootingStars = "";
	//console.log('star');	
	var xpos = randomDec(0,100);
	var ypos = randomNum(0,512);
	var d = randomNum(200,1000);
	//var foo = (condition) ? true : false;
	var xvel = (randomDec(0,1) > 0.5) ? "+="+randomNum(10,100)+"px" : "-="+randomNum(10,100)+"px" ;
	var yvel = (randomDec(0,1) > 0.5) ? "+="+randomNum(10,100)+"px" : "-="+randomNum(10,100)+"px" ;

	shootingStars = "<i id='shootingStar1' class='stars' style='top:" + ypos + "px; left: " +xpos+ "%; background-color: white;'></i>";
	document.getElementById("shootingStars").innerHTML = shootingStars;

	$( "#shootingStar1" ).animate({
    	left: xvel,
    	top: yvel,
    	opacity: 0
		}, {
		duration: d,
    	specialEasing: {
      		top: "linear",
      		left: "linear"
    	},
	    complete: function() {
	      //$( this ).remove();
	    }

  	});
		
}
setInterval(function(){ shootingStars() }, 500);



function clouds() {
	var clouds = "";

	if (raining) {

		$("#clouds img").remove();

	    // $( "#clouds" ).css({
	    //   'background-image': 'url(/ref/img/rain/rain-cloud.png)',
	    //   'background-position': '0 bottom'
	    // });

		clouds =  "<div class='rain-cloud'></div>";
		document.getElementById("clouds").innerHTML = clouds;

	} else {
		for (i =0; i < 8; i++) { 

			var cimg = randomNum(3,4);
			var x = randomDec(0,screenWidth);
			var y = randomNum(0,128);
			var h = randomNum(35,45);
			var w = randomNum(85,105);

			clouds = clouds + "<img src='img/cloud" +cimg+ ".png' id='cloud" +i+ "' class='clouds' style='top:" + y + "px; left: " +x+ "px; height: " +h+ "px; width: "+w+"px;' />";
			document.getElementById("clouds").innerHTML = clouds;
			// panClouds(i,x,w)

		}		
	}




	function panClouds(i,x,w) {
		//console.log(i + ", " + x + ", " + w)
 		var cloudSpeed = randomDec(.03,.08);

		setInterval(function(){ 
			var leftInteger = parseInt(document.getElementById("cloud" + i).style.left, 10);
			sMod = cloudSpeed * windSpeed;


			if (windDirection == 'east') {
				x = x + sMod;
			} else {
				x = x - sMod;
			}

			$( "#cloud" + i ).css('left', x);
 
			if (leftInteger > screenWidth) {  
				x = (0-w);	
			} else if (leftInteger < (0-w)) {  
				x = screenWidth;
			}

		}, 17);
	}

}








function waves() {
	var waves = "";

	//lane 1
	for (i =0; i < 40; i++) { 

		var x = randomDec(0,screenWidth);
		var y = randomNum(10,35);
		//default 130 x 24
		var w = randomNum(10,20);
		var h = randomNum(3,6);
		var s = randomDec(.02,.10);
		var o = randomDec(0,1);


		waves = waves + "<img src='img/wave.png' id='wave" +i+ "' class='waves' style='top:" + y + "px; left: " +x+ "px; height: " +h+ "px; width: "+w+"px;' />";

		document.getElementById("water").innerHTML = waves;

		panWaves(i,x,y,w,h,s,o)

	}

	//lane 2
	for (i =41; i < 70; i++) { 

		var x = randomDec(0,screenWidth);
		var y = randomNum(75,275);
		//default 130 x 24
		var w = randomNum(50,70);
		var h = randomNum(7,11);
		var s = randomDec(.05,.20);
		var o = randomDec(0,1);


		waves = waves + "<img src='img/wave.png' id='wave" +i+ "' class='waves' style='top:" + y + "px; left: " +x+ "px; height: " +h+ "px; width: "+w+"px;' />";

		document.getElementById("water").innerHTML = waves;

		panWaves(i,x,y,w,h,s,o)

	}

	//lane 3
	for (i =71; i < 90; i++) { 

		var x = randomDec(0,screenWidth);
		var y = randomNum(275,675);
		//default 130 x 24
		var w = randomNum(100,160);
		var h = randomNum(15,35);
		var s = randomDec(.10,.50);
		var o = randomDec(0,1);

		waves = waves + "<img src='img/wave.png' id='wave" +i+ "' class='waves' style='top:" + y + "px; left: " +x+ "px; height: " +h+ "px; width: "+w+"px;' />";

		document.getElementById("water").innerHTML = waves;

 
		panWaves(i,x,y,w,h,s,o)

	}	

	function panWaves(i,x,y,w,h,s,o) {
		//console.log("wave" + i + ", x initial position: " + x + ", initila width: " + w + ", initial height: " + h)
		// i = Wave id
		// x = X position
		// y = Y position
		// w = Wave width
		// h = Wave height
		// s = Wave speed
		// o = Wave opacity



		var swellToggle = true;

		setInterval(function(){ 
			var widthInteger = parseInt(document.getElementById("wave" + i).style.left, 10); //converts number string into number integer
			var heightInteger = parseInt(document.getElementById("wave" + i).style.height, 10);
			sMod = s * windSpeed;


			//pan
			if (windDirection == 'east') {
				x = x + sMod; //waves go right at speed
			} else {
				x = x - sMod; //waves go left at speed
			}
			$( "#wave" + i ).css('left', x); //update position
			if (widthInteger > screenWidth) { //wave goes past the right side, then reset
				x = 0;	
			} else if (widthInteger < 0) { // wave goes past left side, then resets 
				x = screenWidth;
			}


			//swell
			if(heightInteger >= h){swellToggle = true;}
			if(heightInteger <= 0){swellToggle = false;}
			if (swellToggle == false) {
				h = h + s;
				y = y - s; //offset
				o = o + 0.02;
			}

			if(swellToggle == true){
				h = h - s;
				y = y + s; //offset
				o = o - 0.02;
			}			

			$( "#wave" + i ).css('height', h);
			$( "#wave" + i ).css('top', y);
			$( "#wave" + i ).css('opacity', o);

		}, 17);
	}

}

waves();




function boat(){
  $("#boat").animate({top:"-=4px"},1000,"easeInCubic").animate({top:"+=4px"}, 1000,"easeInCubic");

  $("#boatWater").animate({left:"-=4px"},1000,"linear").animate({left:"+=4px"}, 1000,"linear");
  
}
setInterval(function(){ boat() }, 2000);





// function to generate drops
function rain() {

	var x 		= windSpeed * 10;
	var y 		= randomNum(850,950);
	var deg 	= windSpeed;
	var img 	= "rain400.png";


	// if (windSpeed == 0) {
	// 	img = "rain50.png";
	// };

	// if (windSpeed == 1) {
	// 	img = "rain100.png";
	// };

	if (windSpeed == 100) {
		x = 100;
		y = 2000;
		deg = 60;
		img = "rain800.png";
	}

	if (windDirection == "east") {
		deg = -deg;
	} else if (windDirection == "west") {
		deg = deg;
	}


    $( ".rain" ).css({
      WebkitTransform: 'rotate(' + deg + 'deg)',
      '-moz-transform': 'rotate(' + deg + 'deg)',
      'background-image': 'url(/img/rain/' + img + ')'
    });


    function rainGo() {
	    $('.rain').animate({backgroundPosition:  '+=' +x+ ' +=' +y }, 
	        1000, "linear", function() { rainGo(); }); 
    }
	rainGo();
}





function dropSplash() {
	setInterval(function(){ 
		var r = randomNum(0,1000);
		var p = randomNum(0,1000);

		$( ".drop-splash" ).css('background-position', r, p); 
	}, 100);
}
// dropSplash();

