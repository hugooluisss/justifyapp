function panelRegistro(){
	$.get("vistas/registro.html", function(resp){
		$("#modulo").html(resp);
		$("[data-mask]").inputmask();

		$("#txtEmail").focus();
		
		$("#btnReset").click(function(){
			if (confirm("¿Seguro?"))
				location.reload(true);
		});
		
		$("#frmAdd").validate({
			debug: false,
			errorElement: 'div',
			rules: {
				txtNombre: "required",
				txtEmail: {
					email: true,
					required: true,
					remote: {
						url: server + "index.php?mod=cusuarios&action=validaEmail",
						type: "post",
						data: {
							usuario: function(){
								return $("#id").val();
							}
						}
					}
				},
				txtPass: "required"
			},
			wrapper: 'span', 
			messages: {
				txtNombre: "Escribe el nombre",
				txtEmail: {
					required: "Este campo es necesario",
					email: "Escribe un correo electrónico válido",
					remote: "Este email ya corresponde a un usuario registrado"
				},
				txtPass: "Escribe una contraseña"
			},
			submitHandler: function(form){
				var obj = new TUsuario;
				
				obj.add($("#id").val(), $("#txtNombre").val(), $("#txtEmail").val(), $("#selSexo").val(), $("#selTipo").val(), {
					before: function(){
						
					},
					after: function(result){
						if (result.band != true)
							alert("Ocurrió un error al guardar los datos");
						else{
							$("#id").val(result.id);
							
							obj.setPass(result.id, $("#txtPass").val(), {
								after: function(resp){
									if (resp.band){
										alert("Su registro ha sido completado");
										location.reload(true);
									}else
										alert("Ocurrió un problema al registrar sus datos");
								}
							});
						}
						
					}
				});
			}
		});
	});
};