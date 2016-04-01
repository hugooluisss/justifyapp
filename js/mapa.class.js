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
	            zoom: 11,
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
	
	this.getDireccion = function(latitud, longitud, fn){
		if (fn.before != undefined) fn.before();
		
		if (self.geocoder === undefined)
			self.geocoder = new google.maps.Geocoder;
		
		self.geocoder.geocode({'location': {lat: latitud, lng: longitud}}, function(results, status){
			if (status === google.maps.GeocoderStatus.OK) {
				console.log("Dirección encontrada: " + results[1].formatted_address);
				if (fn.ok !== undefined) fn.ok(results);
			}else
				if (fn.error !== undefined) fn.error();
				
			if (fn.after != undefined) fn.after(results);
		});
	};
}

