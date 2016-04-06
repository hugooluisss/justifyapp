function getPanelCliente(){
	$.get("vistas/cliente/index.html", function(resp){
		$("#modulo").html(resp);
		
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
		
		getIndex();
	});
	
	function getIndex(){
		var usuario = new TUsuario;
		
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