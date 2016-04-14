function getPanelCliente(){
	$.get("vistas/cliente/index.html", function(resp){
		$("#modulo").html(resp);
		
		$("#menuPrincipal a").click(function(){
			$('#menuPrincipal').parent().removeClass("in");
			$('#menuPrincipal').parent().attr("aria-expanded", false);
		});
		
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
		
		$("#menuPrincipal .miCuenta").click(function(){
			getPanelMiCuentaCliente();
		});
		
		$("#menuPrincipal .buscarPorEspecialidad").click(function(){
			getBuscarPorEspecialidad();
		});
		
		getIndex();
	});
	
	function getIndex(){
		var usuario = new TUsuario;
		$("#fotoPerfil").attr("src", usuario.getURIFotoPerfil());
		
		$("#spNombre").html(usuario.getNombre());
		var mapa = new TMapa;
		
		$("#btnBuscarZona").click(function(){
			$.get("vistas/cliente/buscarMaps.html", function(resp){
				$("#panelTrabajo").html(resp);
				$("#mapa").css('width', '100%');
				$("#mapa").css('height', '300px');
				
				$("div[role=alert]").html("Se está cargando el mapa, espera un momento...").show(600);
				
				mapa.inicializar($("#mapa")[0]);
				mapa.getUbicacion({
					before: function(){
						$("div[role=alert]").html("Te estamos ubicando dentro del mapa...");
					},
					after: function(){
						$("div[role=alert]").delay(5000).hide(600);
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
			});
			
			$("#btnEnviarMensaje").click(function(){
				var usuario = new TUsuario;
				usuario.sendMensaje(usuario.identificador(), $("#btnEnviarMensaje").attr("abogado"), $("#txtMensaje").val(), {
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
	};
};

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
						$("#mensajes").html("<b>¡¡¡ Upss !!!</b>" + " Ocurrió un error " + mensaje).addClass("alert-danger").fadeIn(1500);
				        setTimeout(function() {
				        	$("#mensajes").fadeOut(1500).removeClass("alert-danger");
				        }, 5000);
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
			        $("#mensajes").html("<b>¡¡¡ Upss !!!</b>" + " No se Pudo subir la imagen").addClass("alert-danger").fadeIn(1500);
			        
			        setTimeout(function() {
			        	$("#mensajes").fadeOut(1500).removeClass("alert-danger");
			        }, 5000);
				}, {
					quality: 50,
					destinationType: Camera.DestinationType.FILE_URI
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

function getBuscarPorEspecialidad(){
	$.get("vistas/cliente/porEspecialidad.html", function(resp){
		$("#panelTrabajo").html(resp);
		var usuario = new TCliente;
		usuario.getEspecialidades({
			after: function(lista){
				var tabla = $("#especialidades");
				$.get("vistas/cliente/listaEspecialidad.html", function(resp){
					$.each(lista, function(){
						var el = this;
						vista = $(resp);
						
						vista.find("[campo=nombre]").text(el.nombre);
						vista.find("[campo=descripcion]").text(el.descripcion);
						vista.attr("idespecialidad", el.idEspecialidad).attr("nombre", el.nombre);
						vista.find(".badge").html(el.total);
						
						vista.click(function(){
							head = $(this);
							
							$.get("vistas/cliente/oficina.html", function(tplOficina){
								usuario.getOficinasEspecialidad(head.attr("idespecialidad"), {
									before: function(){
										head.find(".abogados").text("Espere mientras actualizamos la lista");
									},
									after: function(resp){
										head.find(".abogados").text("");
										var ofi = tplOficina;
										$.each(resp, function(){
											var elemento = this;
											var oficina = $(ofi);
											
											oficina.find("[campo=nombre]").text(elemento.nombre);
											oficina.find("img").prop("src", server + "repositorio/imagenesUsuarios/img_" + elemento.idUsuario + ".jpg");
											head.find(".abogados").append(oficina);
										});
									}
								});
							});
						});
						
						tabla.append(vista);
					});
				});
			}
		});
	});
}