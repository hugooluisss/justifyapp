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
						console.log(el.telefono);
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
									"direccion": el.direccion
								}).append($("<i />", {
									"class": "glyphicon glyphicon-pencil"
								}))
							)
						);
						
						tabla.append(tr);
					});
					
					$("[action=modificar]").click(function(){
						var el = $(this)
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
					txtLatitud: "Es necesario este valor",
					txtLongitud: "Es necesario este valor",
					txtDireccion: "Es necesario este valor",
					txtTelefono: "Es necesario este valor"
				},
				submitHandler: function(form){
					obj.updateOficina($("#id").val(), $("#txtDireccion").val(), $("#txtLatitud").val(), $("#txtLongitud").val(), $("#txtTelefono").val(), {
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