TCliente = function(){
	var self = this;
	this.sesion = window.localStorage.getItem("sesion");
	
	this.getOficinas = function(latitud, longitud, fn){
		if (fn.before != undefined) fn.before();
		
		var data = JSON.parse(this.sesion);
		
		$.post(server + '?mod=coficinas&action=listaOficinasCercanasJSON', {
			"latitud": latitud,
			"longitud": longitud
		}, function(lista){
			console.log("Se obtuvieron " + lista.length + " oficinas");
			
			if (fn.after != undefined) fn.after(lista);
		}, "json");
	}
	
	this.getData = function(fn){
		if (fn.before != undefined) fn.before();
		var usuario = new TUsuario;
		
		$.post(server + 'index.php?mod=cclientes&action=getData', {
			"id": usuario.getIdentificador()
		}, function(resp){
			if (fn.after != undefined) fn.after(resp);
		}, "json");
	};
	
	this.guardarPerfil = function(id, nombre, telefono, celular, fn){
		if (fn.before != undefined) fn.before();
		
		$.post(server + 'index.php?mod=cclientes&action=guardar', {
			"id": id,
			"nombre": nombre,
			"telefono": telefono,
			"celular": celular
		}, function(data){
			if (fn.after != undefined)
				fn.after(data);
				
			if (data.band == false)
				console.log("Error al modificar los datos del perfil de usuario");
		}, "json");
	};
};