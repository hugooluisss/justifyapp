$(document).ready(function(){
	if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT)
		WebView.setWebContentsDebuggingEnabled(true);
		
	var usuario = new TUsuario;
	
	if (usuario.isSesionIniciada()){
		switch(usuario.isSesionIniciada()){
			case '2':
				getPanelAbogado();
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

