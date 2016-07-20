function getPanelCliente(){
	$.get("vistas/cliente/index.html", function(resp){
		$("#modulo").html(resp);
		
		$("#menuPrincipal a").click(function(){
			$('#menuPrincipal').parent().removeClass("in");
			$('#menuPrincipal').parent().attr("aria-expanded", false);
		});
		
		//Opciones del menú
		$("#menuPrincipal .salir").click(function(){
			alertify.confirm("¿Seguro?", function(e){
				if(e){
					var obj = new TUsuario;
					obj.logout({
						after: function(){
							location.reload(true);
						}
					});
				}
			});
		});
		
		$("#menuPrincipal .miCuenta").click(function(){
			getPanelMiCuentaCliente();
		});
		
		$("#menuPrincipal .buscarPorEspecialidad").click(function(){
			getBuscarPorEspecialidad();
		});
		
		$("#menuPrincipal .buscarPorZona").click(function(){
			getBuscarPorZona();
		});
		
		getIndex();
	});
	
	function getIndex(){
		var usuario = new TUsuario;
		$("#fotoPerfil").attr("src", usuario.getURIFotoPerfil());
		getRemitentes();
		
		$("#spNombre").html(usuario.getNombre());
		
		$("#btnBuscarZona").click(function(){
			getBuscarPorZona();
		});
	};
};

function getBuscarPorZona(){
	var mapa = new TMapa;
	$.get("vistas/cliente/buscarMaps.html", function(resp){
		$("#panelTrabajo").html(resp);
		$("#mapa").css('width', '100%');
		$("#mapa").css('height', '300px');
		
		alertify.log("Se está cargando el mapa, espera un momento...");
		
		mapa.inicializar($("#mapa")[0]);
		mapa.getUbicacion({
			before: function(){
				alertify.log("Te estamos ubicando dentro del mapa...");
			},
			after: function(){
			},
			sucedio: function(position){
				var cliente = new TCliente;
				cliente.getOficinas(position.coords.latitude, position.coords.longitude, {
					after: function(lista){
						var tabla = $("#oficinas");
						$.get("vistas/cliente/listaOficinas.html", function(resp){
							$.each(lista, function(){
								var el = this;
								vista = $(resp);
								
								vista.find("h4").text(el.nombre);
								vista.find("p").text(el.direccion);
								vista.find("[action=ubicar]").click(function(){
									mapa.map.setCenter({lat: parseFloat(el.latitud), lng: parseFloat(el.longitud)});
									mapa.map.setZoom(16);
									
								});
								
								vista.find("[action=detalle]").click(function(){
									$("#winDetalle").find(".img-thumbnail").prop("src", server + "repositorio/imagenesUsuarios/img_" + el.idUsuario + ".jpg?" + Math.random());
									$("#winDetalle #nombre").html(el.nombre);
									$("#winDetalle #direccion").html(el.direccion);
									$("#winDetalle #email").html(el.email);
									$("#winDetalle #telefono").html(el.telefono);
									$("#winDetalle #celular").html(el.celular);
									$("#winDetalle #btnEnviarMensaje").attr("abogado", el.idUsuario);
									
									$("#winDetalle").modal();
								});
								
								tabla.append(vista);
								
								var marker = new google.maps.Marker({
									position: new google.maps.LatLng(el.latitud, el.longitud),
									map: mapa.map,
									icon: "images/negocio.png",
									title: el.nombre
								});
							});
						});
					}
				});
				
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
					map: mapa.map,
					icon: "images/yo2.png",
					title: 'Tu ubicación'
				});
			}
		});
		
		$("#btnEnviarMensaje").click(function(){
			console.log("Listo para enviar el mensaje");
			var obj = new TMensaje;
			obj.add($("#btnEnviarMensaje").attr("abogado"), $("#txtMensaje").val(), {
				before: function(){
					$("#btnEnviarMensaje").prop("disabled", true);
				},
				after: function(result){
					$("#btnEnviarMensaje").prop("disabled", false);
					if (result.band == true)
						$("#winDetalle").modal("hide");
				}
			});
		});
	});
}

function getPanelMiCuentaCliente(){
	$.get("vistas/cliente/miCuenta.html", function(resp){
		$("#panelTrabajo").html(resp);
		
		$("#mensajes").hide();
		var usuario = new TUsuario;
		var cliente = new TCliente;
		cliente.getData({
			after: function(datos){
				$("#txtNombre").val(datos.nombre);
				$("#txtTelefono").val(datos.telefono);
				$("#txtCelular").val(datos.celular);
			}
		});
		
		$("#fotoPerfil").attr("src", usuario.getURIFotoPerfil());
		
		$("#btnGaleriaPerfil").click(function(){
			if (navigator.camera != undefined){
				navigator.camera.getPicture(function(imageData) {
						$("#fotoPerfil").attr("src", imageData);
						subirFotoPerfil(imageData);
					}, function(message){
						alertify.error("<b>¡¡¡ Upss !!!</b>" + " Ocurrió un error " + mensaje);
					}, { 
						quality: 50,
						destinationType: navigator.camera.DestinationType.FILE_URI,
						sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
					});
			}
		});
		
		$("#btnCamaraPerfil").click(function(){
			if (navigator.camera != undefined){
				navigator.camera.getPicture(function(imageURI){
					$("#fotoPerfil").attr("src", imageURI);
					
					subirFotoPerfil(imageURI);
					
				}, function(){
					alertify.error("<b>¡¡¡ Upss !!!</b>" + " No se Pudo subir la imagen");
				}, {
					quality: 50,
					destinationType: Camera.DestinationType.FILE_URI
				});
			}else{
				alertify.error("<b>¡¡¡ Upss !!!</b>" + " No se cargó subir la imagen");
			}
		});
		
		$("#frmDatos").validate({
			debug: false,
			errorElement: 'div',
			rules: {
				txtNombre: "required",
				txtTelefono: "required",
				txtCelular: "required"
			},
			wrapper: 'span', 
			messages: {
				txtNombre: "Escribe el nombre",
				txtTelefono: "Este campo es necesario",
				txtCelular: "Este campo es necesario",
			},
			submitHandler: function(form){
				var obj = new TCliente;
				var cliente = new TUsuario;
				
				obj.guardarPerfil(cliente.getIdentificador(), $("#txtNombre").val(), $("#txtTelefono").val(), $("#txtCelular").val(), {
					before: function(){
						
					},
					after: function(result){
						if (result.band != true){
							alertify.error("<b>¡¡¡ Upss !!!</b>" + " Ocurrió un error al guardar los datos");
						}else{
							alertify.success("<b>¡¡¡ Ok !!!</b>" + " Los datos se guardaron con éxito");
						}
						
					}
				});
			}
		});
	});
	
	function subirFotoPerfil(imageURI){
		var usuario = new TUsuario;
		var options = new FileUploadOptions();
		
		options.fileKey = "file";
		options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
		options.mimeType = "image/jpeg";
		
		var params = new Object();
		params.identificador = usuario.getIdentificador();
		
		options.params = params;
		
		var ft = new FileTransfer();
		ft.upload(imageURI, encodeURI(server + "?mod=cusuarios&action=uploadImagenPerfil"), function(r){
				console.log("Code = " + r.responseCode);
		        console.log("Response = " + r.response);
		        console.log("Sent = " + r.bytesSent);
		        
		        alertify.success("<b>¡¡¡ Listo !!!</b>" + " Fotografía cargada con éxito");
		        
		        
			}, function(error){
				alertify.error("<b>¡¡¡ Error fatal !!!</b>" + " No se pudo subir la imagen al servidor " + error.target);
		        
			    console.log("upload error source " + error.source);
			    console.log("upload error target " + error.target);
			}, options);
	}
}

function getBuscarPorEspecialidad(){
	$.get("vistas/cliente/porEspecialidad.html", function(resp){
		$("#panelTrabajo").html(resp);
		var usuario = new TCliente;
		usuario.getEspecialidades({
			after: function(lista){
				var tabla = $("#especialidades");
				$.get("vistas/cliente/listaEspecialidad.html", function(resp){
					$("#btnRegresar").click(function(){
						getBuscarPorEspecialidad();
					});
					$.each(lista, function(){
						var el = this;
						
						if (el.total > 0){
							vista = $(resp);
							
							vista.find("[campo=nombre]").text(el.nombre);
							vista.find("[campo=descripcion]").text(el.descripcion);
							vista.attr("idespecialidad", el.idEspecialidad).attr("nombre", el.nombre);
							vista.find(".badge").html(el.total);
							
							vista.click(function(){
								$(".btn-group").show();
								getOficinas($(this));
								
								
							});
							
							tabla.append(vista);
						}
					});
				});
			}
		});
		
		function getOficinas(head){
			$("#panelTrabajo > h3").text("Especialidad de " + head.attr("nombre"));
			
			$.get("vistas/cliente/oficina.html", function(tplOficina){
				usuario.getOficinasEspecialidad(head.attr("idespecialidad"), {
					before: function(){
						$("#especialidades").text("Espere mientras actualizamos la lista");
					},
					after: function(resp){
						$("#especialidades").text("");
						var ofi = tplOficina;
						$.each(resp, function(){
							var elemento = this;
							var oficina = $(ofi);
							
							oficina.find("[campo=nombre]").text(elemento.nombre);
							$.each(elemento, function(key, val){
								oficina.find("[action=detalle]").attr(key, val);
							});
							oficina.find("img").prop("src", server + "repositorio/imagenesUsuarios/img_" + elemento.idUsuario + ".jpg?" + Math.random());
							oficina.find("[action=detalle]").click(function(){
								$("#winDetalle #nombre").html($(this).attr("nombre"));
								$("#winDetalle #direccion").html($(this).attr("direccion"));
								$("#winDetalle #email").html($(this).attr("email"));
								$("#winDetalle #telefono").html($(this).attr("telefono"));
								$("#winDetalle #celular").html($(this).attr("celular"));
								$("#winDetalle #btnEnviarMensaje").attr("abogado", $(this).attr("idUsuario"));
								
								$("#winDetalle").find("img").attr("src", server + "repositorio/imagenesUsuarios/img_" + $(this).attr("idUsuario") + ".jpg?" + Math.random());
								
								$("#txtMensaje").val("");
								
								$("#winDetalle").modal();
							});
							
							$("#especialidades").append(oficina);
						});
					}
				});
			});
		}
	
		$("#btnEnviarMensaje").click(function(){
			if ($("#txtMensaje").val() == ''){
				alertify.error("Escribe un mensaje");
				$("#txtMensaje").focus();
			}else{
				var mensaje = new TMensaje();
				
				mensaje.add($("#winDetalle #btnEnviarMensaje").attr("abogado"), $("#txtMensaje").val(), {
					before: function(){
						$("#winDetalle #btnEnviarMensaje").prop("disabled", true);
					},
					after: function(resp){
						$("#winDetalle #btnEnviarMensaje").prop("disabled", false);
						
						if(resp.band == true){
							alertify.log("El mensaje se envió con éxito, muy pronto se pondrá en contacto contigo"); 
							$("#winDetalle").modal("hide");
						}else
							alertify.error("No se pudo enviar el mensaje"); 
					}
				});
			}
		});
	});
}