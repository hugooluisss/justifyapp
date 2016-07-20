//var server = 'http://192.168.0.111/justify/';
//var server = 'http://localhost/justify/';
var server = 'http://panel.justify.com.mx/';
//var server = 'http://192.168.2.4/justify/';

var key_google = "AIzaSyAFa9dJnYA73gbJSdoery99NTOzUgbdL3w";


var goldStar = {
	path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
	fillColor: 'yellow',
	fillOpacity: 0.8,
	scale: 1,
	strokeColor: 'gold',
	strokeWeight: 14
};

$(document).ready(function(){
	$("#modulo").css("min-height", (screen.height - 50) + "px");
	//$("#div_carga").hide();
	$(document).ajaxStart(function() {
		$(this).show();
	}).ajaxStop(function() {
		$(this).hide();
	});
});

var TConekta = function(){
	self = this;
	this.publica = "key_QerMuaZim2Fv6PQzxLpbMcQ";
	
	this.doPago = function(tarjeta, nombre, anio, mes, codigo, paquete, fn){
		if (fn.before != undefined) fn.before();
		
		Conekta.setPublishableKey(self.publica);
		var tokenParams = {
			"card": {
				"number": $("#txtTarjeta").val(),
				"name": $("#txtNombre").val(),
				"exp_year": $("#selAnio").val(),
				"exp_month": $("#selMes").val(),
				"cvc": $("#txtCodigo").val()
			}
		};
		
		Conekta.token.create(tokenParams, function(token){
			var usuario = new TUsuario;
			
			$.post(server + '?mod=cpublicidad&action=pago', {
				"token": token.id,
				"abogado": usuario.getIdentificador(),
				"paquete": paquete
			}, function(resp) {
				console.log(resp);
				if (fn.after != undefined) fn.after(resp);
			});
			
		}, function(resp){
			console.log("No se pudo obtener el token de la transacción");
			
			if (fn.error != undefined) fn.error(resp.message_to_purchaser);
		});
	};
}