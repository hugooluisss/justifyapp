$(document).ready(function(){
	var usuario = new TUsuario;
	
	if (usuario.isSesionIniciada()){
		switch(usuario.isSesionIniciada()){
			case '2':
				console.log("Eres abogado");
			break;
			case '3':
				getPanelCliente();
			break;
			default:
				alert("No sabemos que eres " + usuario.isSesionIniciada());
		}
	}else{
		loadLogin();
	}
});

