//var imagenEditor, imagenEditor2;

var initImgSim = function() {
	/*
	//para cargar la imagen normal
		imagenEditor2 = new imageEdit({
			idParent:"initCanvas",
			singularId:"test",
			imgPreload:{
				"caballo":{
					"src":"",
					"alt":"",
					"format":"",
					"nombre":""
					},
				"perros":{
					"src":"",
					"alt":"",
					"format":"",
					"nombre":""
					},
				"escultura":{
					"src":"",
					"alt":"",
					"format":"",
					"nombre":""
					},
				"amigos":{
					"src":"",
					"alt":"",
					"format":"",
					"nombre":""

				}
			}
		});
	*/

	//console.log(imgObj);
	/*Para cargar las imagenes desde la BD Moodle*/
	/*imagenEditor2 = new imageEdit({
		idParent:"initCanvas",
		singularId:"test",
		imgPreload: imgObj
	});
	*/

	if (!render) {
		alert(
			"Recuerda tener espacios disponibles para respuesta antes de modificar y crear una nueva respuesta."
		);
	};
};


/*
	Moodle
*/

var moodleReact = function(operation, data, idP) {
	customLog("------------", "#540DC9");
	console.log(operation);
	//console.log(respuesta[cMoodleEdit]);
	//cambiar el switch por lo que se obtenga de la variable correspondiente en el lang cuando se haga para mas idiomas
	switch (operation) {
		case "loadImg":
			//si no es el render se crea la interfaz para agregar la imagen al banco de preguntas
			if (!render) {
				var imgD_Template = $(
					'<div class="imgDesc"><img src="" alt=""><div class="textoImagen"><label class="obligatoria">Nombre:</label><input class="nameUp "type="text" ><label>Texto alternativo</label><input placeholder="Opcional" class="altTextUp" type="text"><label>Formato:</label><input class="formatUp" disabled="disabled" type="text"><p class="saveImgMoodle">Agregar imagen al banco de imágenes</></div></div>'
				)
				var tmpD = imgD_Template.clone();
				tmpD.find("img").attr("src", data.src);
				tmpD.find(".formatUp").val(data.format);

				tmpD.find("input.nameUp").on("keyup", function(e) {
					tmpD.find(".saveImgMoodle").removeClass("saved").text("Guardar imagen");
				});

				/*Para guardar las imagenes de la pregunta*/
				tmpD.find(".saveImgMoodle").on("click", function(e) {


					var nombre = $(this).parent().find("input.nameUp").val();
					console.warn(nombre);
					if (nombre.length > 0) {
						if ($(this).hasClass("saved")) {
							console.log("cancelar guardado");
							$(this).removeClass("saved");
							$(this).text("Guardar imagen");
						} else {
							console.log("guardada");
							$(this).addClass("saved");
							$(this).text("Imagen guardada");
						}
					} else {
						alert(
							"La imagen no se puede agregar al banco de imágenes sin nombre. Introduzca un nombre para identificar a la imagen."
						);
					}

					$("input#id_images").val("").text("");
					var imgArray = generaImg2Base();
					$("input#id_images").val(imgArray).text(imgArray);

					console.warn("???");
					console.log($("input#id_images").val());

				});


				$(".imgUpDesc").append(tmpD);

				console.warn("no es el render");
			} else {
				console.log("es el render");
			}

			addAnswPart("cargar imagen");

			//console.log(data);
			//customLog("Pegando algo en moodle", "#540DC9");
			console.log(respuesta[cMoodleEdit]);
			break;
		case "draw":
			addAnswPart("dibujar");
			break;
		case "eraser":
			addAnswPart("borrar");
			break;
		case "rectangle":
			addAnswPart("poner rectángulo");
			break;
		case "line":
			addAnswPart("poner linea");
			break;
		case "circle":
			addAnswPart("poner circulo");
			break;
		case "path":
			addAnswPart("dibujar lineas");
			break;
		case "text":
			addAnswPart("agregar texto");
			break;
		case "select":
			addAnswPart("seleccionar");
			break;
		case "move":
			addAnswPart("mover");
			break;
		case "rotate":
			addAnswPart("rotar");
			break;
		case "scale":
			addAnswPart("escalar");
			break;
		case "crop":
			addAnswPart("cortar");
			break;
		case "bkgcolor":
			addAnswPart("cambiar color de fondo");
			break;
		case "addLayer":
			addAnswPart("se agrego una capa");
			break;
		case "fusionLayers":
			addAnswPart("se fusionaron las capas");
			break;
		case "removeLayer":
			addAnswPart("se removio una capa");
			break;
		default:
			/*if ( respuesta[cMoodleEdit][respuesta[cMoodleEdit].length - 1] != ("Se uso "+ operation +", ") ) {
				respuesta[cMoodleEdit].push("Se uso "+ operation +", ");
				customLog("Se uso "+ operation +", ", "#F6F900", "#000000");
			}else{
				customLog("Misma Operacion "+ operation , "#9B05E9");
			}*/
			customLog("Operacion ??? " + operation, "#9B05E9");
	}
};

//función que agrega las palabras para el enunciado
var addAnswPart = function(toAdd) {
	console.log(respuesta[cMoodleEdit]);
	console.log("numero de respuesta " + respuesta[cMoodleEdit].length);



	if (respuesta[cMoodleEdit][respuesta[cMoodleEdit].length - 1] != (", " +
			toAdd) && respuesta[cMoodleEdit][respuesta[cMoodleEdit].length - 1] !=
		toAdd) {
		if (respuesta[cMoodleEdit].length < 1) {
			respuesta[cMoodleEdit].push(toAdd);
		} else {
			respuesta[cMoodleEdit].push(", " + toAdd);
			//customLog(toAdd +", ", "#F6F900", "#000000");
		}
	} else {
		customLog("Ya estaba " + toAdd, "#9B05E9");
	}
};

var cMoodleEdit = "",
	editActive = false;;


var respuestaString = "";

var initMoodleAddBtn = function() {
	$("fieldset#id_answerhdr div.fitem.fitem_fgroup").each(function(n, ele) {
		console.log("respuesta : " + n);
		if ($(ele).find("input").val().length > 0) {
			$("select#id_fraction_" + n).after('<p class="eraseAnsw" data-answ="' + n +
				'">Eliminar</p>');
		} else {
			//console.log("input[name='answer["+n+"]'] -> esta vacio");
		};
	});

	initMoodleEraseBtn();
};

var initMoodleEraseBtn = function() {
	$("p.eraseAnsw").unbind("click").on("click", function() {
		//el aris hace referencia al index de la respuesta a borrar
		var aris = $(this).attr("data-answ");
		//caja de respuestas de moodle
		var arisParent = $(this).parent();
		//inputs de moodle para la respuesta
		var selectBlock = arisParent.find("select");
		var inputBlock = arisParent.find("input");
		//cambiar el texto
		inputBlock.val("").text("");
		//cambair el selecta a Ninuguno(a)
		selectBlock.attr("value", "0.0").val("0.0");

		$('[data-answ="' + aris + '"]').remove();
	});
};

var initEventsMoodle = function() {
	/*Para guardar el simumlador inicial*/
	$("#bDuplica_imgsim").on("click", function(e) {
		saveInitCanvas();
	});

	/*Para generar la respuesta*/
	$(".btnRes:not(.renderBtn)").on("click", function(e) {
		//se copia el arreglo que va a ir a la base de datos para recobrar las imagenes
		$("input#id_images").val("").text("");
		var imgArray = generaImg2Base();
		$("input#id_images").val(imgArray).text(imgArray);

		respuestaString = "";
		console.log(respuesta[cMoodleEdit]);
		for (var i = 0; i < respuesta[cMoodleEdit].length; i++) {
			console.log(respuesta[cMoodleEdit][i]);
			respuestaString += respuesta[cMoodleEdit][i];
		};
		console.log(respuestaString);
		if ($("input[name='answer[0]']").val().length > 0) {
			console.log("Esta lleno el primer espacio, pasando al 1")
			addAnswesField(1, respuestaString);
		} else { //guardado de la respuesta 0
			$("input[name='answer[0]']").val(respuestaString).text(respuestaString); //se actualiza el campo de respuesta
			//se quita para evitar que se incluya mas de un boton
			$('[data-answ="0"]').remove();
			$("select#id_fraction_0").after(
				'<p class="eraseAnsw" data-answ="0">Eliminar</p>');
			initMoodleEraseBtn(); //se crea el evento que borra el input y reinicia el select
			var fraction = String((Number($("#answCal").val())));
			if (fraction.indexOf(".") == -1) {
				fraction += ".0"
			};
			$("select[name='fraction[0]']").attr("value", fraction).val(fraction);
			console.log("Rediz select -> " + String((Number($("#answCal").val()))));
			console.log("select fraction[] -> " + $("select[name='fraction[0]']").val());
		}
	});

	/*Override de los eventos de image Sim*/
	$(".buscarImg img").on("click", function(e) {
		console.log("tambien hago esto");
	});

	$(".open_Op").on("click", function(e) {
		//respuesta[cMoodleEdit].push( "Se cargo una imagen , ");
		customLog("Se cargo una imagen", "#F6F900", "#000000");
	});

	$(".saveAIMG").on("click", function(e) {
		respuesta[cMoodleEdit].push("Se salvo una imagen , ");
		customLog("Se salvo una imagen", "#F6F900", "#000000");
	});

	$(".initCanvas, .resCanvas")
		.on("mouseover", function(e) {
			cMoodleEdit = $(this).attr("id");
			editActive = true;
			console.log("Editor activo -> " + cMoodleEdit);
		})
		.on("mouseout", function(e) {
			editActive = false;
			//console.log( "editor desactivado" );
		});

	$('input').keypress(function(e) {
		if (e.keyCode == 13) {
			if (editActive) {
				e.preventDefault();
				//console.log("ha! enter key is disabled");
			};
		}
	});

	//render events
	var respuestaString = "";
	$('.renderBtn, input[name=next]').on('click', function() {
		//para el guardado independiente de las respuestas a partir del moodleId
		var tmpAnswId = $(this).attr("moodleid").replace(/_/g, ":") + "_answer";
		respuestaString = ""; //se reinicia el string de respuestas
		customLog("Guardando respuesta", "#0024FF");
		for (var i = 0; i < respuesta[cMoodleEdit].length; i++) {
			//console.log(respuesta[cMoodleEdit][i]);
			respuestaString += respuesta[cMoodleEdit][i]; //se genera el string de respuesta
		};
		//console.log(respuestaString);
		//alert("Guardando respuesta -> " + respuestaString);
		alert("Guardando respuesta");
		console.log('.answer input[name="' + tmpAnswId + '"]');
		$('.answer input[name="' + tmpAnswId + '"]').attr("value", respuestaString)
			.text(respuestaString);
		//console.log("la respuesta tiene el valor de -> " + $(".answer input").attr("value"));
	});


	/**/
};


var saveInitCanvas = function() {
	//actualizar el campo para restaurar el simulador inicial
	console.log("salvar el canvas inicial");
	var layers2Save = imagenEditor_initCanvas.layers;
	var redizIm = {};

	//recorrer el arreglo de capas
	for (var i = 0; i < layers2Save.length; i++) {
		//exportar la imagen a dataURL en un arreglo que se guardara en la base de Moodle
		redizIm[layers2Save[i]] = imagenEditor_initCanvas.exportDataURL(layers2Save[
			i]);
		//se copia el canvas i del simulador inicial al de resultado
		imagenEditor_resCanvas.loadCanvas(redizIm[layers2Save[i]]);
	};
	console.log(redizIm);
	//se guarda la cadena resultante
	$("#id_operations ").val(JSON.stringify(redizIm)).text(JSON.stringify(redizIm));

	console.log($("#id_operations").val());
	console.warn("/*/*/*/*/*/*/")
	console.log(respuesta);
};

var eraseAllSim = function(objSimEd) {
	/*console.warn("restaura valores iniciales");
	console.log(objSimEd);
	console.warn("*********");	*/
	$("#" + objSimEd.boss + " .removeLayer").each(function(i, e) {
		$(e).trigger('click');
	});
	/*for (var i = 0; i < objSimEd.layers.length; i++) {
		console.log(objSimEd.layers[i]);
	};*/

	restartImgSim(objSimEd);
};

var restartImgSim = function(objSimEd) {
	var canvasData;
	//console.warn("restaurar: ");
	//console.log(iniView);
	for (key in iniView[cMoodleEdit]) {

		canvasData = iniView[cMoodleEdit][key];
		//console.log(canvasData);


		if (render) {
			objSimEd.loadCanvas(canvasData);
		} else {
			imagenEditor_initCanvas.loadCanvas(canvasData);
			imagenEditor_resCanvas.loadCanvas(canvasData);
		}
	}
};

//variable para crear el objeto que va a ir a la base;
var generaImg2Base = function() {
	var imagenesAbase = {};
	/*var currentImg = JSON.parse($("input#id_images").val());

	//se añaden las existentes en la base
	var imgD_Template = $('<div class="imgDesc"><img src="" alt=""><div class="textoImagen"><label class="obligatoria">Nombre:</label><input class="nameUp "type="text" ><label>Texto alternativo</label><input placeholder="Opcional" class="altTextUp" type="text"><label>Formato:</label><input class="formatUp" disabled="disabled" type="text"><p class="saveImgMoodle">Agregar imagen al banco de imágenes</></div></div>')
	for (key in currentImg) {

		var tmpD = imgD_Template.clone();
		tmpD.find("img").attr("src",currentImg[key].src);
		tmpD.find(".formatUp").val(currentImg[key].format);
		tmpD.find(".altTextUp").val(currentImg[key].alt || "");
		tmpD.find(".nameUp").val(currentImg[key].nombre);

		tmpD.find("input.nameUp").on("keyup", function(e){
			tmpD.find(".saveImgMoodle").addClass("saved").text("Guardada");
		});

		//Para guardar las imagenes de la pregunta
		tmpD.find(".saveImgMoodle").on("click", function(e){
		console.log("???");
		var nombre = $(this).parent().find("input.nameUp").val();
		console.warn(nombre);
		if (nombre.length > 0) {
			if ( $(this).hasClass("saved") ) {
				console.log("cancelar guardado");
				$(this).removeClass("saved");
				$(this).text("Guardar imagen");
			}else{
				console.log("guardada");
				$(this).addClass("saved");
				$(this).text("Guardada");
			}
		}else{
			alert("La imagen no se puede agregar al banco de imágenes sin nombre. Introduzca un nombre para identificar a la imagen.");
		}
		});

		$(".imgUpDesc").append(tmpD);
		//imagenesAbase[key] = currentImg[key];
	}*/

	//se añaden las nuevas de la base;
	$(".imgDesc").each(function(index, element) {
		//$(".saveImgMoodle.saved").each(function(index, element){
		//console.log("elemento " + index + " salvada = " + $(element).find(".saveImgMoodle").hasClass("saved"));
		if ($(element).find(".saveImgMoodle").hasClass("saved")) {
			var tmpObj;
			tmpObj = {
				"src": $(element).find("img").attr("src"),
				"alt": $(element).find("input.altTextUp").val(),
				"format": $(element).find("input.formatUp").val(),
				"nombre": $(element).find("input.nameUp ").val()
			};
			imagenesAbase[$(element).find("input.nameUp ").val()] = tmpObj;
			delete tmpObj;
		};

	});

	//console.log(imagenesAbase);
	//ya que se crea el objeto se pasa a texto para que se pueda almacenar en la base de datos
	return JSON.stringify(imagenesAbase);
};



//guarda la respuesta en el campo de respuesta
//si no hay donde guardar envia alerta
var addAnswesField = function(newIndex, respuestaString) {
	console.warn(respuestaString);
	console.log("tratando de crear nueva respuesta con input[name='answer[" +
		newIndex + "]']");
	//console.log($("input[name='answer["+newIndex+"]']").val());
	if (String($("input[name='answer[" + newIndex + "]']").val()) == "undefined") {
		//alert("necesitas mas campos de respuesta");
		$("#tmpJsonC2").append(
			"<h1>No hay espacio para respuesta. <br> El editor se reiniciará</h1>").css(
			"color", "orange");
		setTimeout(function() {
			$("#tmpJsonC2").children().remove();
		}, 6000);
	} else if ($("input[name='answer[" + newIndex + "]']").val().length > 0) {
		console.log("el campo " + newIndex + " esta lleno");
		addAnswesField(++newIndex, respuestaString);
	} else {
		console.log("tratando de guardar en el campo " + "input[name='answer[" +
			newIndex + "]']");
		if ($("#answCal").attr("value") < 1.0) {
			alert("recuerda que debes tener una respuesta al 100%");
		};

		console.warn("respuesta : ");
		console.log(respuestaString);
		$("input[name='answer[" + newIndex + "]']").val(respuestaString).text(
			respuestaString);
		//var fraction = String((Number($("#answCal").val()))*100);
		var fraction = String((Number($("#answCal").val())));
		if (fraction.indexOf(".") == -1) {
			fraction += ".0"
		};

		$("select[name='fraction[" + newIndex + "]']").attr("value", fraction).val(
			fraction);

		$('[data-answ="' + newIndex + '"]').remove();
		$("select#id_fraction_" + newIndex).after('<p class="eraseAnsw" data-answ="' +
			newIndex + '">Eliminar</p>');
		initMoodleEraseBtn();

		//console.log("Rediz select -> "+ String((Number($("#answCal").val()))));
		//console.log("select fraction[] -> " + $("select[name='fraction["+newIndex+"]']").val());
	}
};
