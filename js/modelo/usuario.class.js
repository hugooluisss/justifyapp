TUsuario = function(){
	var self = this;
	this.sesion = window.localStorage.getItem("sesion");
	
	this.add = function(id, nombre, email, sexo, perfil, fn){
		if (fn.before != undefined) fn.before();
		
		$.post(server + '?mod=cusuarios&action=add', {
			"id": id,
			"nombre": nombre,
			"email": email,
			"sexo": sexo,
			"perfil": perfil
		}, function(data){
			if (data.band == 'false')
				console.log("Upps. Ocurrió un error al agregar al cliente " + data.mensaje);
				
			if (fn.after != undefined)
				fn.after(data);
		}, "json");
	}
	
	this.setPass = function(usuario, pass, fn){
		if (fn.before != undefined)
			fn.before(data);
				
		$.post(server + 'index.php?mod=cusuarios&action=setPass', {
			"usuario": usuario,
			"pass": pass
		}, function(data){ 
			if (fn.after != undefined)
				fn.after(data);
		}, "json");
	};
	
	this.del = function(usuario, fn){
		$.post(server + 'index.php?mod=cusuarios&action=del', {
			"usuario": usuario,
		}, function(data){
			if (fn.after != undefined)
				fn.after(data);
			if (data.band == 'false'){
				alert("Ocurrió un error al eliminar al usuario");
			}
		}, "json");
	};
	
	this.login = function(usuario, pass, fn){
		$.post(server + 'index.php?mod=clogin&action=login', {
			"usuario": usuario,
			"pass": pass,
			"movil": 1
		}, function(data){
			if (data.band == false){
				console.log("Los datos del usuario no son válidos");
			}else{
				var datos = data.datos;
				if (datos.tipo == '' || datos.tipo == '1')
					console.log("Acceso denegado a usuario de tipo administrador");
				else{
					var obj = new Object;
					obj.identificador = datos.identificador;
					obj.usuario = usuario;
					obj.tipo = datos.tipo;
					obj.nombre = datos.nombre;
					
					window.localStorage.setItem("sesion", JSON.stringify(obj));
				}
			}
			
			if (fn.after != undefined)
				fn.after(data);
		}, "json");
	}
	
	this.logout = function(fn){
		if (fn.before != undefined) fn.before();
		
		window.localStorage.clear();
		
		if (fn.after != undefined) fn.after();
	}
	
	this.isSesionIniciada = function(){
		if (this.sesion == '' || this.sesion == undefined)
			return false;
		else{
			var data = JSON.parse(this.sesion);
			
			return data.tipo;
		}
	}
	
	this.getNombre = function(){
		var data = JSON.parse(this.sesion);
			
		return data.nombre;
	}
	
	this.getIdentificador = function(){
		var data = JSON.parse(this.sesion);
			
		return data.identificador;
	}
	
	this.sendMensaje = function(abogado, cliente, mensaje){
		if (fn.before != undefined) fn.before();
		
		$.post(server + 'index.php?mod=clogin&action=login', {
			"abogado": abogado,
			"cliente": cliente,
			"mensaje": mensaje
		}, function(result){
			if (result.band == false)
				console.log("No se pudo guardar el mensaje");
				
			if (fn.after != undefined) fn.after(result);
		}, "json");
	}
	
	this.getURIFotoPerfil = function(){
		return server + 'repositorio/imagenesUsuarios/img_' + self.getIdentificador() + '.jpg';
	}
};