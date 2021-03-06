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
	
	this.getData = function(fn){
		if (fn.before != undefined) fn.before();
		var usuario = new TUsuario;
		
		$.post(server + 'index.php?mod=cabogados&action=getData', {
			"id": usuario.getIdentificador()
		}, function(resp){
			if (fn.after != undefined) fn.after(resp);
		}, "json");
	};
	
	this.guardarPerfil = function(id, nombre, sobreMi, curriculum, fn){
		if (fn.before != undefined) fn.before();
		
		$.post(server + 'index.php?mod=cabogados&action=guardar', {
			"id": id,
			"nombre": nombre,
			"sobreMi": sobreMi,
			"curriculum": curriculum
		}, function(data){
			if (fn.after != undefined)
				fn.after(data);
				
			if (data.band == false)
				console.log("Error al modificar los datos del perfil de usuario");
		}, "json");
	};
	
	this.getEspecialidades = function(fn){
		if (fn.before != undefined) fn.before();
		var usuario = new TUsuario;
		
		$.post(server + 'index.php?mod=cespecialidad&action=getLista', {
			"id": usuario.getIdentificador()
		}, function(resp){
			if (fn.after != undefined) fn.after(resp);
		}, "json");
	};
	
	this.addEspecialidad = function(especialidad, fn){
		if (fn.before != undefined) fn.before();
		var usuario = new TUsuario;
		
		$.post(server + '?mod=cabogados&action=addEspecialidad', {
			"abogado": usuario.getIdentificador(),
			"especialidad": especialidad
		}, function(data){
			if (data.band == 'false')
				console.log("Upps. Ocurrió un error al agregar la especialidad " + data.mensaje);
				
			if (fn.after != undefined)
				fn.after(data);
		}, "json");

	}
	
	this.delEspecialidad = function(especialidad, fn){
		if (fn.before != undefined) fn.before();
		var usuario = new TUsuario;
		
		$.post(server + '?mod=cabogados&action=delEspecialidad', {
			"abogado": usuario.getIdentificador(),
			"especialidad": especialidad
		}, function(data){
			if (data.band == 'false')
				console.log("Upps. Ocurrió un error al quitar la especialidad " + data.mensaje);
				
			if (fn.after != undefined)
				fn.after(data);
		}, "json");

	}
};