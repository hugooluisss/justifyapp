TUsuario = function(){
	var self = this;
	this.sesion = window.localStorage.getItem("sesion");
	
	this.setPass = function(usuario, pass, fn){
		$.post(server + 'index.php?mod=cusuarios&action=setPass', {
			"usuario": usuario,
			"pass": pass
		}, function(data){ 
			if (data.band == 'false'){
				fn.error(data);
			}else{
				fn.ok(data);
			}
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
			"pass": pass
		}, function(data){
			if (fn.after != undefined)
				fn.after(data);
				
			if (data.band == 'false'){
				console.log("Los datos del usuario no son válidos");
			}else{
				var datos = data.datos;
				
				var obj = new Object;
				obj.identificador = datos.identificador;
				obj.usuario = usuario;
				obj.tipo = datos.tipo;
				
				window.localStorage.setItem("sesion", JSON.stringify(obj));
				
				localStorage.getItem();
			}
		}, "json");
	}
	
	this.isSesionIniciada = function(){
		if (this.sesion == '' || this.sesion == undefined)
			return false;
		else{
			var data = JSON.parse(this.sesion);
			
			return data.tipo;
		}
	}
};