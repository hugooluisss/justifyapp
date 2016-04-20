function getPanelAbogado(){
	$.get("vistas/abogado/index.html", function(resp){
		$("#modulo").html(resp);
		$("div[role=alert]").hide();
		
		var abogado = new TUsuario;
		$("#fotoPerfil").attr("src", abogado.getURIFotoPerfil());
		
		//Opciones del menú
		$("#menuPrincipal .salir").click(function(){
			if(confirm("¿Seguro?")){
				var obj = new TUsuario;
				obj.logout({
					after: function(){
						location.reload(true);
					}
				});
			}
		});
		
		$("#menuPrincipal a").click(function(){
			$('#menuPrincipal').parent().removeClass("in");
			$('#menuPrincipal').parent().attr("aria-expanded", false);
		});
		
		$("#menuPrincipal .oficinas").click(function(){
			getOficinas();
		});
		
		$("#menuPrincipal .miCuenta").click(function(){
			getPanelMiCuentaAbogado();
		});
		
		$("#menuPrincipal .categorias").click(function(){
			getPanelEspecialidades();
		});
		
		getIndex();
	});
	
	function getIndex(){
		var usuario = new TUsuario;
		
		$("#spNombre").html(usuario.getNombre());
		getRemitentes();
		
		var suscripcion = new TSuscripcion;
		suscripcion.getSuscripcion({
			after: function(suscripcion){
				if (suscripcion.band == true){
					var tr = $("<tr />").append(
						$('<td />', {text: suscripcion.nombre})
					).append($('<td />', {text: suscripcion.inicio})
					).append($('<td />', {text: suscripcion.fin}));
				}else{
					var tr = $("<tr />").append(
						$("<td />", {colspan: 3, text: "No tienes un servicio de publicidad contratado"})
					);
					
					var btnPlan = $('<btn/>', {class: "btn btn-danger btn-sm btn-block", text: "Adquirir suscripción"});
					$(".table").parent().append(btnPlan);
					
					btnPlan.click(function(){
						$("#txtPrecio").val($("#selSuscripcion option:selected").attr("precio"));
						$("#winConekta").modal();
					});
				}
				
				
				$(".table").append(tr);
			}
		});
		
		suscripcion.getPlanes({
			after: function(planes){
				$.each(planes, function(i, plan){
					$("#selSuscripcion").append($("<option />", {value: plan.idPaquete, text: plan.nombre, precio: plan.precio}));
				});
				
				$("#selSuscripcion option:first-children").prop("selected", true);
			}
		});
		
		$("#selSuscripcion").change(function(){
			$("#txtPrecio").val($("#selSuscripcion option:selected").attr("precio"));
		});
		
		
		fecha = new Date;
		for (paso = 0; paso < 10; paso++)
			$("#selAnio").append($("<option />", {value: fecha.getFullYear() + paso, text: fecha.getFullYear() + paso}));
			
		$("#frmSuscripcion").validate({
			debug: true,
			rules: {
				txtTarjeta: {
					required : true
				},
				txtCodigo: {
					required : true
				},
				txtNombre: {
					required: true
				},
				selMes: {
					required : true
				},
				selAnio: {
					required : true
				},
				selPaquete:{
					required : true
				}
			},
			wrapper: 'span', 
			messages: {
				txtTarjeta: "Escribe el número de tarjeta",
				txtCodigo: "Escribe el código de seguridad",
				selMes: "Selecciona el mes en que expira tu tarjeta",
				selAnio: "Selecciona el año en el que expira tu tarjeta",
				selPaquete: "Selecciona un paquete",
				txtNombre: "Escribe el nombre que tiene impreso la tarjeta"
			},
			submitHandler: function(form){
				//Se inicia con la generación de un token
				var conecta = new TConekta;
				conecta.doPago($("#txtTarjeta").val(), $("#txtNombre").val(), $("#selAnio").val(), $("#selMes").val(), $("#txtCodigo").val(), $("#selSuscripcion").val(), {
					before: function(){
						$("#btnPagar").prop("disabled", true);
					},
					after: function(resp){
						$("#btnPagar").prop("disabled", false);
						if (resp.band == false)
							alert(resp.mensaje);
						else{
							alert("El pago se realizó con éxito");
							
							$("#frmSuscripcion")[0].reset();
							getPanelAbogado();
							$("#winConekta").modal("hide");
						}	
						
					},
					error: function(resp){
						$("#btnPagar").prop("disabled", false);
						alert(resp);
					}
				});
			}
		});
	};
	
	function getOficinas(){
		$.get("vistas/abogado/oficinas.html", function(resp){
			$("#panelTrabajo").html(resp);
			$("#panelModificar").hide();
			var obj = new TAbogado;
			
			var mapa = new TMapa;
			$("#mapa").css('width', '100%');
			$("#mapa").css('height', '200px');
			mapa.inicializar($("#mapa")[0]);
			
			$("#btnPosicionActual").click(function(){
				if (confirm("¿Seguro de querer tomar la posición actual como la de la oficina?")){
					mapa.getUbicacion({
						before: function(){
							$("div[role=alert]").html("Te estamos ubicando dentro del mapa...").show();
						},
						after: function(){
							$("div[role=alert]").html("Listo").delay(5000).hide(600);
						},
						sucedio: function(position){
							$("#txtLatitud").val(position.coords.latitude);
							$("#txtLongitud").val(position.coords.longitude);
							
							mapa.getDireccion(position.coords.latitude, position.coords.longitude, {
								ok: function(results){
									if ($("#txtDireccion").val() != results[1].formatted_address){
										if(confirm("El servidor encontró que la dirección es diferente, ¿desea asignarla?... " + results[1].formatted_address))
											$("#txtDireccion").val(results[1].formatted_address);
									}
								}
							});
							
							var marker = new google.maps.Marker({
								position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
								map: mapa.map,
								title: 'Oficina'
							});
							
							$("#txtTelefono").focus();
						}
					});
				}
			});
			
			obj.getOficinas({
				after: function(lista){
					var tabla = $("#panelTrabajo .table tbody");
					
					$.each(lista, function(){
						var el = this;
						console.log(el.encargado);
						var tr = $("<tr />").append(
							$("<td />", {
								text: el.encargado == null?"":el.encargado
							})
						).append(
							$("<td />", {
								"class": "text-center"
							}).append(
								$("<button />", {
									"class": "btn btn-primary",
									"action": "modificar",
									"oficina": el.idOficina,
									"telefono": el.telefono,
									"direccion": el.direccion,
									"encargado": el.encargado,
									"latitud": el.latitud,
									"longitud": el.longitud
								}).append($("<i />", {
									"class": "glyphicon glyphicon-pencil"
								}))
							)
						);
						
						tabla.append(tr);
					});
					
					$("[action=modificar]").click(function(){
						var el = $(this);
						$("#panelModificar #txtEncargado").val(el.attr("encargado"));
						$("#panelModificar #txtTelefono").val(el.attr("telefono"));
						$("#panelModificar #txtDireccion").val(el.attr("direccion"));
						$("#panelModificar #txtLatitud").val(el.attr("latitud"));
						$("#panelModificar #txtLongitud").val(el.attr("longitud"));
						$("#panelModificar #id").val(el.attr("oficina"));
						
						$("#panelOficinas").hide(600);
						$("#panelModificar").show(600);
						
						mapa.getUbicacion({});
					});
				}
			});
			
			$("div[role=alert]").html("Espera un momento...").show(600);
			$("#mensajes").hide();
			
			$("#frmAdd").validate({
				debug: true,
				rules: {
					txtEncargado: {
						required : true
					},
					txtLatitud: {
						required : true
					},
					txtLongitud: {
						required : true
					},
					txtDireccion: {
						required : true
					},
					txtTelefono: {
						required : true
					}
				},
				wrapper: 'span', 
				messages: {
					txtEncargado: "Es necesario un encargado del despacho",
					txtLatitud: "Es necesario este valor",
					txtLongitud: "Es necesario este valor",
					txtDireccion: "Es necesario este valor",
					txtTelefono: "Es necesario este valor"
				},
				submitHandler: function(form){
					obj.updateOficina($("#id").val(), $("#txtDireccion").val(), $("#txtLatitud").val(), $("#txtLongitud").val(), $("#txtTelefono").val(), $("#txtEncargado").val(), {
						after: function(result){
							if (result.band == true){
								$("#mensajes").html("<b>¡¡¡ Ok !!!</b>" + " Datos guardados").addClass("alert-success").fadeIn(1500);
					        setTimeout(function() {
					        	$("#mensajes").fadeOut(1500).removeClass("alert-success");
					        }, 5000);
								getOficinas();
							}else{
								$("#mensajes").html("<b>¡¡¡ Upss !!!</b>" + " Ocurrió un error al guardar los datos").addClass("alert-danger").fadeIn(1500);
						        setTimeout(function() {
						        	$("#mensajes").fadeOut(1500).removeClass("alert-danger");
						        }, 5000);
							}
						}
					});
				}
			});
		});
	}
};


function getPanelMiCuentaAbogado(){
	$.get("vistas/abogado/miCuenta.html", function(resp){
		$("#panelTrabajo").html(resp);
		
		var objAbogado = new TAbogado;
		objAbogado.getData({
			after: function(resp){
				$("#txtNombre").val(resp.nombre);
				$("#txtCurriculum").val(resp.curriculum);
				$("#txtSobreMi").val(resp.sobreMi);
			}
		});
		
		$("#mensajes").hide();
		var abogado = new TUsuario;
		$("#fotoPerfil").attr("src", abogado.getURIFotoPerfil());
		
		$("#btnGaleriaPerfil").click(function(){
			if (navigator.camera != undefined){
				navigator.camera.getPicture(function(imageData) {
						$("#fotoPerfil").attr("src", imageData);
						subirFotoPerfil(imageData);
					}, function(message){
						$("#mensajes").html("<b>¡¡¡ Upss !!!</b>" + " Ocurrió un error " + mensaje).addClass("alert-danger").fadeIn(1500);
				        setTimeout(function() {
				        	$("#mensajes").fadeOut(1500).removeClass("alert-danger");
				        }, 5000);
					}, { 
						quality: 50,
						destinationType: navigator.camera.DestinationType.FILE_URI,
						sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
						targetwidth: 300,
						targetHeight: 200,
						saveToPhotoAlbum: false
					});
			}
		});
		
		$("#btnCamaraPerfil").click(function(){
			if (navigator.camera != undefined){
				navigator.camera.getPicture(function(imageURI){
					$("#fotoPerfil").attr("src", imageURI);
					
					subirFotoPerfil(imageURI);
					
				}, function(){
			        $("#mensajes").html("<b>¡¡¡ Upss !!!</b>" + " No se Pudo subir la imagen").addClass("alert-danger").fadeIn(1500);
			        
			        setTimeout(function() {
			        	$("#mensajes").fadeOut(1500).removeClass("alert-danger");
			        }, 5000);
				}, {
					quality: 50,
					destinationType: Camera.DestinationType.FILE_URI,
					targetwidth: 300,
					targetHeight: 200,
					saveToPhotoAlbum: false
				});
			}else{
				$("#mensajes").html("<b>¡¡¡ Upss !!!</b>" + " No se cargó la cámara ").addClass("alert-danger").fadeIn(1500);
		        setTimeout(function() {
		        	$("#mensajes").fadeOut(1500).removeClass("alert-danger");
		        }, 5000);
			}
		});
		
		$("#frmDatos").validate({
			debug: false,
			errorElement: 'div',
			rules: {
				txtNombre: "required",
				txtSobreMi: "required"
			},
			wrapper: 'span', 
			messages: {
				txtNombre: "Escribe el nombre",
				txtSobreMi: "Escribe algo sobre tu buffet"
			},
			submitHandler: function(form){
				var obj = new TAbogado;
				var abogado = new TUsuario;
				
				obj.guardarPerfil(abogado.getIdentificador(), $("#txtNombre").val(), $("#txtSobreMi").val(), $("#txtCurriculum").val(), {
					before: function(){
						
					},
					after: function(result){
						if (result.band != true){
							$("#mensajes").html("<b>¡¡¡ Upss !!!</b>" + " Ocurrió un error al guardar los datos").addClass("alert-danger").fadeIn(1500);
					        setTimeout(function() {
					        	$("#mensajes").fadeOut(1500).removeClass("alert-danger");
					        }, 5000);
						}else{
							$("#mensajes").html("<b>¡¡¡ Ok !!!</b>" + " Los datos se guardaron con éxito").addClass("alert-success").fadeIn(1500);
					        setTimeout(function() {
					        	$("#mensajes").fadeOut(1500).removeClass("alert-success");
					        }, 5000);
						}
						
					}
				});
			}
		});

	});
	
	function subirFotoPerfil(imageURI){
		var abogado = new TUsuario;
		var options = new FileUploadOptions();
		
		options.fileKey = "file";
		options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
		options.mimeType = "image/jpeg";
		
		var params = new Object();
		params.identificador = abogado.getIdentificador();
		
		options.params = params;
		
		var ft = new FileTransfer();
		ft.upload(imageURI, encodeURI(server + "?mod=cusuarios&action=uploadImagenPerfil"), function(r){
				console.log("Code = " + r.responseCode);
		        console.log("Response = " + r.response);
		        console.log("Sent = " + r.bytesSent);
		        
		        $("#mensajes").html("<b>¡¡¡ Listo !!!</b>Fotografía cargada con éxito ").addClass("alert-success").fadeIn(1500);
		        
		        setTimeout(function() {
		        	$("#mensajes").fadeOut(1500).removeClass("alert-success");
		        }, 5000);
		        
			}, function(error){
		        $("#mensajes").html("<b>¡¡¡ Error fatal !!!</b>" + " No se pudo subir la imagen al servidor " + error.target).addClass("alert-danger").fadeIn(1500);
		        
		        setTimeout(function() {
		        	$("#mensajes").fadeOut(1500).removeClass("alert-danger");
		        }, 5000);
			    
			    console.log("upload error source " + error.source);
			    console.log("upload error target " + error.target);
			}, options);
	}
}




function getPanelEspecialidades(){
	$.get("vistas/abogado/especialidades.html", function(resp){
		$("#panelTrabajo").html(resp);
		
		var tabla = $("#especialidades");
		var usuario = new TAbogado;
		usuario.getEspecialidades({
			after: function(lista){
				$.get("vistas/abogado/listaEspecialidad.html", function(resp){
					$.each(lista, function(){
						var el = this;
						vista = $(resp);
						
						vista.find("label").text(el.nombre);
						vista.find("label").attr("for", "el_" + el.idEspecialidad);
						vista.find("input").val(el.idEspecialidad);
						vista.find("input").attr("id", "el_" + el.idEspecialidad);
						
						vista.find("input").prop("checked", el.agregado == 'si');
						
						tabla.append(vista);
					});
					
					$("input[type=checkbox]").change(function(){
						var el = $(this);
						var abogado = new TAbogado;
						
						if(el.prop("checked"))
							abogado.addEspecialidad(el.val(), {
								before: function(){
									el.prop("disabled", true);
								},
								after: function(resp){
									el.prop("disabled", false);
									
									if (resp.band != true){
										alert("No se pudo agregar esta especialidad");
										el.attr("checked", false);
									}
								}
							});
						else
							abogado.delEspecialidad(el.val(), {
								before: function(){
									el.prop("disabled", true);
								},
								after: function(resp){
									el.prop("disabled", false);
									
									if (resp.band != true){
										alert("No se pudo quitar esta especialidad");
										el.attr("checked", true);
									}
								}
							});
					});
				});
			}
		});
	});
}