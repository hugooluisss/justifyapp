TMapa = function(){
	var self = this;
	this.map;
	this.div = "";
	
	this.inicializar = function(div){
		this.div = div;
		
		var mapOptions = {
			zoom: 4,
			center: new google.maps.LatLng(-33, 151),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}
 
		self.map = new google.maps.Map(div, mapOptions);
	}
	
	this.getUbicacion = function(fn){
		if (fn.before != undefined)
			fn.before();
			
		navigator.geolocation.getCurrentPosition(function(position){
			var longitude = position.coords.longitude;
	        var latitude = position.coords.latitude;
	        var latLong = new google.maps.LatLng(latitude, longitude);
	
	        var mapOptions = {
	            center: latLong,
	            zoom: 13,
	            mapTypeId: google.maps.MapTypeId.ROADMAP
	        };
	
	        self.map = new google.maps.Map(self.div, mapOptions);
	        
	        if (fn.sucedio != undefined)
				fn.sucedio(position);

		}, function(error){
			console.log("Google maps dijo " + error.code + ": " + error.message);
			
			if (fn.error != undefined)
				fn.error(error);
	    });
	    
	    if(fn.after != undefined)
			fn.after();
	}
}

