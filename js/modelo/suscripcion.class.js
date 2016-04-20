TSuscripcion = function(){
	var self = this;
	
	this.getSuscripcion = function(fn){
		if (fn.before != undefined) fn.before();
		var usuario = new TUsuario;
		$.post(server + '?mod=cpublicidad&action=get', {
			"abogado": usuario.getIdentificador()
		}, function(data){
			if (data.band == 'false')
				console.log("Upps. Ocurrió un error al recuperar el estado de su suscripción " + data.mensaje);
				
			if (fn.after != undefined)
				fn.after(data);
		}, "json");
	}
	
	this.getPlanes = function(fn){
		if (fn.before != undefined) fn.before();
		var usuario = new TUsuario;
		$.get(server + '?mod=cpaquete&action=get', function(data){
			if (data.band == 'false')
				console.log("Upps. Ocurrió un error al recuperar la lista de paquetes " + data.mensaje);
				
			if (fn.after != undefined)
				fn.after(data);
		}, "json");
	}
}