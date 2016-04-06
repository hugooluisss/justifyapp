TAbogado = function(){
	var self = this;
	this.sesion = window.localStorage.getItem("sesion");
	
	this.getOficinas = function(fn){
		if (fn.before != undefined) fn.before();
		
		var data = JSON.parse(this.sesion);
		
		$.post(server + '?mod=coficinas&action=listaOficinasJSON', {
			"abogado" : data.identificador
		}, function(lista){
			console.log("Se obtuvieron " + lista.length + " oficinas");
			
			if (fn.after != undefined) fn.after(lista);
		}, "json");
	}
	
	this.updateOficina = function(id, direccion, latitud, longitud, telefono, encargado, fn){
		if (fn.before != undefined) fn.before();
		$.post(server + 'index.php?mod=coficinas&action=add', {
			"id": id,
			"direccion": direccion,
			"latitud": latitud,
			"longitud": longitud,
			"telefono": telefono,
			"encargado": encargado
		}, function(data){
			if (fn.after != undefined)
				fn.after(data);
				
			if (data.band == false)
				console.log("Error al agregar la oficina");
		}, "json");
	};
};