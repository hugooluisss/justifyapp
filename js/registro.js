$(document).ready(function(){
	$("#abogados #txtLocalidad").autocomplete({
		source: server + "index.php?mod=localidad&action=autocomplete",
		minLength: 2,
		select: function(e, el){
			$("#abogados #txtLocalidad").attr("localidad", el.item.identificador);
			$("#abogados #txtLocalidad").attr("anterior", el.item.label);
		}
	});
	
	$("#abogados #frmAdd").validate({
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
			txtTelefono: {
				required: true,
				digits: true,
				minlength: 10,
				maxlength: 10
			},
			txtCelular: {
				required: true,
				digits: true,
				minlength: 10,
				maxlength: 10
			},
			txtLocalidad: {
				required : true,
			}
		},
		wrapper: 'span', 
		messages: {
			txtNombre: "Escribe el nombre",
			txtEmail: {
				required: "Este campo es necesario",
				email: "Escribe un correo electrónico válido",
				remote: "Este email ya corresponde a un usuario registrado"
			},
			txtTelefono: {
				required: "Escribe un número telefónico de contacto",
				minlength: "Debe de ser de 9 números",
				maxlength: "Debe de ser de 9 números",
				digits: "Solo números"
			},
			txtCelular: {
				required: "Escribe un número de celular para las emergencias",
				minlength: "Debe de ser de 9 números",
				maxlength: "Debe de ser de 9 números",
				digits: "Solo números"
			},
			txtLocalidad: {
				required: "Escribe el lugar donde vive"
			},
		},
		submitHandler: function(form){
			var obj = new TAbogado;
			
			obj.add($("#id").val(), $("#txtNombre").val(), $("#selSexo").val(), $("#txtLocalidad").attr("localidad"), $("#txtEmail").val(), $("#txtTelefono").val(), $("#txtCelular").val(), {
				before: function(){
					
				},
				after: function(result){
					if (result.band != true)
						alert("Ocurrió un error al guardar los datos");
					else{
						$("#abogados #frmAdd").get(0).reset();
					}
					
				}
			});
		}
	});
});