function panelMensajes(remitente){
	$.get("vistas/mensajes/conversacion.html", function(resp){
		$("#panelTrabajo").html(resp);
		
		$("#txtMensaje").focus();
		$("#btnEnviarMensaje").attr("cliente", remitente.idUsuario);
		
		function traerMensajes(){
			var objMensaje = new TMensaje;
			objMensaje.getConversacion(remitente.idUsuario, {
				before: function(){
					$("#conversacion").html("");
				},
				after: function(mensajes){
					$.get("vistas/mensajes/mensaje.html", function(plantilla){
						$.each(mensajes, function(){
							var mensaje = this;
							var plMensaje = plantilla;
							plMensaje = $(plMensaje);
							
							plMensaje.find("[campo=fecha]").text(mensaje.fecha);
							plMensaje.find("[campo=mensaje]").text(mensaje.mensaje);
							plMensaje.find("[campo=nombre]").text(mensaje.nombreRemitente);
							plMensaje.find("img").prop("src", server + "repositorio/imagenesUsuarios/img_" + mensaje.remitente + ".jpg");
							
							$("#conversacion").append(plMensaje);
						});
					})
				}
			});
		}
		
		traerMensajes();
		
		$("#btnEnviarMensaje").click(function(){
			var mensaje = new TMensaje;
			mensaje.add($("#btnEnviarMensaje").attr("cliente"), $("#txtMensaje").val(), {
				before: function(){
					$("#btnEnviarMensaje").prop("disabled", true);
				},
				after: function(result){
					$("#btnEnviarMensaje").prop("disabled", false);
					if (result.band == true){
						$("#txtMensaje").val("");
						traerMensajes();
					}else
						alert("Ocurrió un error al enviar su mensaje");
				}
			});
		});
	});
}