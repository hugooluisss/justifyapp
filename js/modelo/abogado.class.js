function TAbogado(){
	this.add = function(id, nombre, sexo, localidad, email, telefono, celular, fn){
		if (fn.before != undefined) fn.before();
		
		$.post(server + 'index.php?mod=cusuarios&action=add', {
			"id": id,
			"nombre": nombre,
			"sexo": sexo,
			"localidad": localidad,
			"email": email,
			"telefono": telefono,
			"celular": celular,
			"perfil": 2
		}, function(data){
			if (data.band == 'false')
				console.log("Upps. Ocurrió un error al agregar al abogado " + data.mensaje);
				
			if (fn.after != undefined)
				fn.after(data);
		}, "json");
	}
};

TAbogado.prototype = new TUsuario;