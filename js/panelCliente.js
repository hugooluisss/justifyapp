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
						var marker = new google.maps.Marker({
							position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
							map: mapa.map,
							title: 'Tu ubicación'
						});
					}
				});
			});
		});
	};
};