$(document).ready(function(){
	var usuario = new TUsuario;
	
	if (usuario.isSesionIniciada()){
		switch(usuario.isSesionIniciada()){
			case 2:
				console.log("Eres abogado");
			break;
			case 3:
				console.log("Eres cliente");
			break;
			default:
		}
	}else{
		loadLogin();
	}
});