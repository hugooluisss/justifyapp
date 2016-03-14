TUsuario = function(){
	var self = this;
	
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
			}
		}, "json");
	}
};