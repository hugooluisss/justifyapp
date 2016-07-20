$(document).ready(function(){
	var usuario = new TUsuario;
	
	if (usuario.isSesionIniciada()){
		switch(usuario.isSesionIniciada()){
			case '2':
				getPanelAbogado();
				getNewMensajes();
				
				setInterval(getNewMensajes, 120000);
			break;
			case '3':
				getPanelCliente();
				getNewMensajes();
				
				setInterval(getNewMensajes, 120000);
			break;
			default:
				alertify.error("No sabemos que eres " + usuario.isSesionIniciada());
		}
	}else{
		loadLogin();
	}
});

function getNewMensajes(){
	var usuario = new TUsuario;
	
	usuario.getNewMensajes({
		after: function(resp){
			if (resp.band == true){
				$("#alertMensajes").html("");
				
				if (resp.band > 0)
					$("#alertMensajes").append($('<span class="badge">' + resp.sinLeer + '</span>'));
				else
					$("#alertMensajes").html("");
			}else
				$("#alertMensajes").html("");
		}
	});
}

function getRemitentes(){
	var usuario = new TUsuario;
	
	$("#btnRemitentes").click(function(){
		usuario.getRemitentesMensajes({
			after: function(resp){
				$("#winMensajes").find(".modal-body").html("");
				
				$.get("vistas/mensajes/lista.html", function(plantilla){
					$.each(resp, function(){
						var el = this;
						var media = plantilla;
						media = $(media);
						
						media.find("[campo=remitente]").text(el.remitente.nombre);
						media.find("[campo=fecha]").text(el.fecha);
						media.find("img").attr("src", server + "repositorio/imagenesUsuarios/img_" + el.remitente.idUsuario + ".jpg?" + Math.random());
						media.click(function(){
							panelMensajes(el.remitente);
							$("#winMensajes").modal("hide");
						});
						
						$("#winMensajes").find(".modal-body").append(media);
					});
				});
			
				$("#winMensajes").modal();
			}
		});
	});
}