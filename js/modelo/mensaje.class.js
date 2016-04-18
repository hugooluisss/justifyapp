TMensaje = function(){
	var self = this;
	
	this.add = function(destinatario, mensaje, fn){
		if (fn.before != undefined) fn.before();
		var usuario = new TUsuario;
		$.post(server + '?mod=cmensajes&action=add', {
			"remitente": usuario.getIdentificador(),
			"destinatario": destinatario,
			"mensaje": mensaje
		}, function(data){
			if (data.band == 'false')
				console.log("Upps. Ocurrió un error al enviar el mensaje " + data.mensaje);
				
			if (fn.after != undefined)
				fn.after(data);
		}, "json");
	}
	
	this.getConversacion = function(usuario2, fn){
		if (fn.before != undefined) fn.before();
		var usuario = new TUsuario;
		
		$.post(server + '?mod=cmensajes&action=getConversacion', {
			"usuario1": usuario.getIdentificador(),
			"usuario2": usuario2
		}, function(data){
			if (data.band == 'false')
				console.log("Upps. Ocurrió un error al recuperarla conversacion " + data.mensaje);
				
			if (fn.after != undefined)
				fn.after(data);
		}, "json");
	}
}