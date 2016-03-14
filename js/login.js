$(document).ready(function(){
	$("div[role=alert]").hide();
	$("#frmLogin").validate({
		debug: true,
		rules: {
			txtUsuario: {
				required : true,
				email: true
			},
			txtPass: {
				required : true
			}
		},
		wrapper: 'span', 
		messages: {
			txtUsuario:{
				required: "Ingresa un usuario",
				email: "El usuario es una cuenta de correo electrónico"
			},
			txtPass: {
				required: "Es necesaria la contraseña"
			}
		},
		submitHandler: function(form){
			var obj = new TUsuario;
			
			obj.login($("#txtUsuario").val(), $("#txtPass").val(), {
				before: function(){
					
				},
				after: function(data){
					if (data.band == false){
						$("div[role=alert]").html("Nombre de usuario y contraseña inválidos").show(600);
						$("div[role=alert]").delay(5000).hide(600);
					}
				}
			});
        }

    });
});