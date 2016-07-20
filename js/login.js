function loadLogin(){
	$.get("vistas/login.html", function(resp){
		$("#modulo").html(resp);
		$("#modulo").addClass("login");
		
		$("#txtUsuario").focus();
			
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
						$("#frmLogin").find("[type=submit]").prop("disabled", true);
					},
					after: function(data){
						$("#frmLogin").find("[type=submit]").prop("disabled", false);
						if (data.band == false)
							alertify.error("Nombre de usuario y contraseña inválidos");
						else{
							//Hay que verificar el perfil de usuario
							if (data.datos.tipo == "1"){
								alertify.error("El rol de administrador no es válido en esta versión del sistema");
							}else
								location.reload(true);
						}
					}
				});
			}
		});
		
		$("#btnSendRegistro").click(function(){
			$("#modulo").removeClass("login");
			panelRegistro();
		});
	});
};