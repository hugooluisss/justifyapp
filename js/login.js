$(document).ready(function(){
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
					if (data.band == false)
						alert("Nombre de usuario y contraseña inválidos");
				}
			});
        }

    });
});