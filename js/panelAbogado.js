function getPanelAbogado(){
	$.get("vistas/abogado/index.html", function(resp){
		$("#modulo").html(resp);
		$("div[role=alert]").hide();
		
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
			$("div[role=alert]").html("Espera un momento...").show(600);
			getOficinas();
		});
		
		$("#menuPrincipal .miCuenta").click(function(){
			$("div[role=alert]").html("Espera un momento...").show(600);
			getPanelMiCuentaAbogado();
		});
		
		getIndex();
	});
	
	function getIndex(){
		var usuario = new TUsuario;
		
		$("#spNombre").html(usuario.getNombre());
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
								text: el.telefono
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
								alert("Datos actualizados");
								getOficinas();
							}else
								alert("Ocurrió un error al guardar los datos");
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
		var abogado = new TUsuario;
		
		$("#mensajes").hide();
		
		$("#btnFotoPerfil").click(function(){
			if (navigator.camera != undefined){
				navigator.camera.getPicture(function(imageData) {
						$("#fotoPerfil").src = "data:image/jpeg;base64," + imageData;
						$("#fotoPerfil").attr("src", "data:image/jpeg;base64," + imageData);
					}, function(message){
						alert("Error: " + mensaje);
					}, { 
						quality: 50
					});
				/*
				navigator.camera.getPicture(function(imageURI){
					var options = new FileUploadOptions();
					options.fileKey = "file";
					options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
					options.mimeType = "image/jpeg";
					
					var params = new Object();
					params.id = abogado.identificador();
					
					options.params = params;
					
					var ft = new FileTransfer();
					ft.upload(imageURI, server + "?mod=cusuarios&action=uploadImagenPerfil", function(r){
							console.log("Code = " + r.responseCode);
					        console.log("Response = " + r.response);
					        console.log("Sent = " + r.bytesSent);
					        
					        $("#mensajes").append("<b>¡¡¡ Listo !!!</b>Fotografía cargada con éxito " + r.responseCode).addClass("alert-success").fadeIn(1500);
					        
					        setTimeout(function() {
					        	$("#mensajes").fadeOut(1500).removeClass("alert-success");
					        }, 5000);
					        
						}, function(error){
					        $("#mensajes").append("<b>¡¡¡ Danger !!!</b>" + " upload error target " + error.target).addClass("alert-danger").fadeIn(1500);
					        
					        setTimeout(function() {
					        	$("#mensajes").fadeOut(1500).removeClass("alert-danger");
					        }, 5000);
					        
						    alert("An error has occurred: Code = " + error.code);
						    
						    console.log("upload error source " + error.source);
						    console.log("upload error target " + error.target);
						}, options);
					
				}, function(){
			        $("#mensajes").append("<b>¡¡¡ Upss !!!</b>" + " No se Pudo subir la imagen").addClass("alert-danger").fadeIn(1500);
			        
			        setTimeout(function() {
			        	$("#mensajes").fadeOut(1500).removeClass("alert-danger");
			        }, 5000);
				}, {
					quality: 50,
					destinationType: Camera.DestinationType.DATA_URL
				});*/
			}else{
				$("#mensajes").append("<b>¡¡¡ Upss !!!</b>" + " No se cargó la cámara ").addClass("alert-danger").fadeIn(1500);
			        
		        setTimeout(function() {
		        	$("#mensajes").fadeOut(1500).removeClass("alert-danger");
		        }, 5000);
			}
		});
	});
}