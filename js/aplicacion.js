//var server = 'http://192.168.0.111/justify/';
var server = 'http://localhost/justify/';
//var server = 'http://panel.justify.com.mx/';
//var server = 'http://192.168.2.4/justify/';

var key_google = "AIzaSyAFa9dJnYA73gbJSdoery99NTOzUgbdL3w";


var goldStar = {
	path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
	fillColor: 'yellow',
	fillOpacity: 0.8,
	scale: 1,
	strokeColor: 'gold',
	strokeWeight: 14
};

$(document).ready(function(){
	//$("#div_carga").hide();
	$(document).ajaxStart(function() {
		$(this).show();
	}).ajaxStop(function() {
		$(this).hide();
	});
});