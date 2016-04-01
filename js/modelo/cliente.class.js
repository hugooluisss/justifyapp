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
};