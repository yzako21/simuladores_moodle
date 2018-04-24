var inittextSim = function() {
	//alert("CARGANDO.....");
	initEventstextsim();
};

//variables para la extraccion de los hijos
var tmpFamily = "",
	childTag = "";
var tmpElement, tmpChild;
//variable para almacenar los estilos que se agregaran a la respuesta
var styleArr = [];
//cariable que marca que se esta agregando una tabla
//--IS -> solo funciona si tiene letrerito
var openTable = false;

var restartAnsPre = function() {
	//console.log(answPrev);
	console.warn("-------");
	console.log(prevAnsR);

	ansCont = $(prevAnsR);
	console.log(ansCont.length);
	$(".contPrevAnsw.textSim").append(ansCont);
	for (var i = 0; i < ansCont.length; i++) {
		$("#id_answer_" + i).parent().before(ansCont[i]);
		//$("#fgroup_id_answeroptions"+i).after(ansCont[i].html());
		eventEraseAnsw();
	};

};

var childUp = function(element) {
	//console.warn("padre " + $(element).prop("tagName"));
	//console.log($(element).html());
	tmpElement.attr("family", tmpElement.attr("family") + $(element).prop(
		"tagName"));
	//verificar si el elemento actual tiene mas hijos
	if (element.children().length > 0) {
		//para recorrer los nietos del elemento referencia
		element.children().each(function(ind, hijo) {
			var parentH = $(hijo).parent();
			if (parentH.attr("style") == undefined) {
				//agregar el stylo en parentStyle para concatenarlo con el que ya tiene
				parentH.attr("style", "");
			};
			//si tiene mas hijos se sacan y se añaden despues del elemento actual
			tmpElement.attr("family", tmpElement.attr("family") + " > ");
			//se extrae el elemento
			tmpChild = $(hijo).detach();
			//se añade el elemento despues de padre
			childTag = tmpChild.prop("tagName");
			//se revisa si es necesario agregar un nuevo estilo
			switch (childTag) {
				case "P":
				case "SPAN":
					//se pide el atributo estilo, si no existe se crea
					if ($(tmpChild).attr("style") == undefined) {
						tmpChild.attr("style", parentH.attr("style"));
					} else {
						$(tmpChild).attr("style", $(parentH).attr("style") + $(tmpChild).attr(
							"style"));
					}
					break;
				case "B":
					//console.warn("B");
					//se pide el atributo estilo, si no existe se crea
					if ($(tmpChild).attr("style") == undefined) {
						$(tmpChild).attr("style", $(parentH).attr("style") +
							" font-weight: bold;");
					} else { //si existe se añade el italic
						$(tmpChild).attr("style", $(parentH).attr("style") + " " + $(tmpChild)
							.attr("style") + " font-weight: bold;");
					}
					//console.log($(tmpChild).attr("style"));
					break;
				case "I":
					//console.warn("I")
					//se pide el atributo estilo, si no existe se crea
					if ($(tmpChild).attr("style") == undefined) {
						$(tmpChild).attr("style", $(parentH).attr("style") +
							" font-style: italic;");
					} else { //si existe se añade el italic
						$(tmpChild).attr("style", $(parentH).attr("style") + " " + $(tmpChild)
							.attr("style") + " font-style: italic;");
					}
					break;
				default:
					//console.warn("No se contemplo " + tagName + " como etiqueta");
			}
			//console.warn("revisando "+  childTag +" - padre " + $(element).prop("tagName"));
			//console.log($(tmpChild).attr("style"));
			//se añade con before para respetar la jerarquia de html que se tiene
			tmpElement.before(tmpChild);
			//se manda el nuevo elemento hijo, en la siguiente vuelta se hace padre
			childUp(tmpChild);
		});
	} else {
		//console.warn("ultimo o unico hijo " + $(element).prop("tagName"));
		//console.log("Else de que no tiene hijos "+ $(element).attr("style"));
		switch ($(element).prop("tagName")) {
			case "CAPTION":
			case "TH":
			case "TD":
				tmpChild = $(element).detach();
				//se pide el atributo estilo, si no existe se crea
				if ($(tmpChild).attr("style") != undefined && $(tmpChild).attr("style") !=
					"") {
					//se añade con before para respetar la jerarquia de html que se tiene
					tmpElement.before(tmpChild);
					//se manda el nuevo elemento hijo, en la siguiente vuelta se hace padre
				}
				break;
			default:
				//console.warn("No se contemplo " + tagName + " como etiqueta");
		}
		//se añade con before para respetar la jerarquia de html que se tiene
		//tmpElement.before(tmpChild);
		//se manda el nuevo elemento hijo, en la siguiente vuelta se hace padre
		//childUp(tmpChild);
	};
};

var childUpTable = function(element) {
	//console.log(element);
	var letrerito = element.find("caption");
	var cabecera = element.find("thead tr");
	var iTH = 0;

	$(element).find(" * ").addClass("tableItem");

	//console.log(element.html());
	//console.warn("Letrerito");
	//console.log(letrerito.html());
	if (letrerito.text().length > 0) {
		if (letrerito.attr("style") == undefined) {
			letrerito.attr("style", "");
		};
		letrerito.attr("style", letrerito.attr("style") + " font-weight: bold;")
	};

	childUp(letrerito);

	//console.warn("cabecera");
	element.find("thead tr th").each(function(i, td) {
		if ($(td).attr("style") == undefined) {
			$(td).attr("style", "");
		};
		if ($(td).text().length > 0) {
			$(td).attr("style", $(td).attr("style") + " font-weight: bold;")
			childUp($(td));
		};
		//console.log($(td).parent().html());

	});
	//console.warn("cuerpo");
	element.find("tbody tr td").each(function(i, td) {
		if ($(td).text().length > 0) {
			if ($(td).attr("style") == undefined) {
				$(td).attr("style", "");
			};
			childUp($(td));
		};
		//console.log($(td).parent().html());

	});


};

//funcion para darle formato a la respuesta una vez que se tienen el arreglo de los estilos
var formatStyle = function(array) {
	var texto = array[1];
	var style = array[0];
	var tag = array[2];
	var classItem = array[3];

	var sepStyle = [];
	var prevAnsCont = $(".contPrevAnsw.textSim .rT:last-child ol");


	var stylekeyVal = [];
	var resume = "";
	var partialAnsw = "";

	//sconsole.log(tag);

	if (classItem === "tableItem" && !openTable) {
		openTable = true;
		answerString += "{";
		prevAnsCont.append("<li><span><b>Inicio de Tabla</b></li>");
	} else if (classItem != "tableItem" && openTable) {
		openTable = false;
		answerString += "}";
		prevAnsCont.append("<span><b>Fin de Tabla</b>");
	};

	/*if (tag == "|CAPTION|") {
		openTable = true;
		tag = tag.replace("|CAPTION|","Letrerito");
	}else if(tag == "|TABLE|") {
		openTable = false;
		tag = tag.replace("|TABLE|","");

	}else{*/
	if (openTable) {
		tag = tag.replace("|P|", "Cambio en una celda:")
			.replace("|SPAN|", "Cambio en una celda:")
			.replace("|B|", "Cambio en una celda:")
			.replace("|I|", "Cambio en una celda:")
			.replace("|TH|", "Cambio en una celda:")
			.replace("|TD|", "Cambio en una celda:")
			.replace("|CAPTION|", "Cambio en una celda:");
	} else {
		tag = tag.replace("|P|", "Cambio en texto:")
			.replace("|SPAN|", "Cambio en texto:")
			.replace("|B|", "Cambio en texto:")
			.replace("|I|", "Cambio en texto:");
	}
	//}

	//si es la letra negra se quita el estilo y se toma como si estuviera normal
	style = style.replace(/color\: rgb\(51, 51, 51\)\;/g, "")

	if (style.length > 0) {
		//console.warn("dar formato a: " + texto);
		style = style.replace(/text-align/g, "alineacion")
			.replace(/color\: rgb\(51, 51, 51\)\;/g, "")
			//para los tipos de letra
			.replace(/font-weight/g, "letra en")
			.replace(/font-style/g, "letra tipo")
			.replace(/font-size/g, "tamaño de texto en")
			.replace(/color/g, "texto en color")
			//para los estilos
			.replace(/bold/g, "negritas")
			.replace(/italic/g, "itálicas")
			.replace(/center/g, "centro")
			.replace(/right/g, "derecha")
			.replace(/left/g, "izquierda")
			//para los colores
			.replace(/rgb\(255, 255, 255\)/g, "blanco")
			.replace(/rgb\(239, 69, 64\)/g, "rojo")
			.replace(/rgb\(255, 207, 53\)/g, "amarillo")
			.replace(/rgb\(152, 202, 62\)/g, "verde")
			.replace(/rgb\(125, 159, 211\)/g, "azul");

		//console.log(style);
		sepStyle = style.split(";");
		console.log(sepStyle);
		//console.warn("dar formato a: " + texto);
		//formar la cadena parcial que se añadira a la respuesta
		console.log(sepStyle);
		/*antes de pasar a la generacion de la respuesta, hacer que se busquen propiedades iguales*/
		for (var i = sepStyle.length - 1; i >= 0; i--) {
			if (sepStyle[i].length > 0) {
				stylekeyVal = sepStyle[i].split(":");
				//si no existe el atributo lo añade
				if (resume.indexOf(stylekeyVal[0]) == -1) {
					partialAnsw += stylekeyVal[1];
					resume += sepStyle[i].replace(":", "") + ", ";
				} //si existe el atributo pero diferente valor
				else if (resume.indexOf(stylekeyVal[1]) == -1) {
					//partialAnsw += stylekeyVal[1];
					//resume += sepStyle[i].replace(":", "") + ", ";
				} else {
					console.warn("caso fuera de registro  " + resume);
				}
				//

			};
		};
		//console.warn(tag+" dice "+texto+ " " + texto.length+ " con " + resume);
		resume = resume.slice(0, -2);
		resume += "."
	} else {
		//console.log(style +" --- " + style.length);
		//console.log("texto  corriente");
	}



	if (array[2] == "|TABLE|") {

	} else if (openTable) {
		previewRender += "<span><b>" + tag + "</b></span><br/><p>" + resume + "</p>";
		prevAnsCont.append("<span><b>" + tag + "</b></span><br/><p>" + resume +
			"</p>");
	} else {
		previewRender += "<li><span><b>" + tag + "</b></span><br/><p>" + resume +
			"</p></li>";
		prevAnsCont.append("<li><span><b>" + tag + "</b></span><br/><p>" + resume +
			"</p></li>");

	}

	if (array[2] != "|TABLE|" && array[2] != "|TR|" && array[2] != "|TD|" &&
		array[2] != "|TBODY|" && array[2] != "|TH|") {
		//se previenen los campos vacios ()
		if (partialAnsw.substr(1).length > 0) {
			answerString = answerString + "(" + partialAnsw.substr(1) + ")";
		};
	};
};

var sInitSim = function(copia) {
	var contenido = $("#id_textosAtto1editable").html();
	//se copia el contenido del simulador inicial en  el de simulador respuesta
	if (copia == 1) {
		console.log(" duplicar ");
		$("#fitem_id_textosAtto2 div[role=textbox]").text("").append(contenido);
	} else {
		console.log("No duplicar ");
	}
	//crea una cadena html para guardarla en la base de datos, se cambian los < para que no se interprete como html y solo se guarde el texto
	contenido = contenido.replace(/</g, "|-|");
	$('#id_initsim')
		.text(contenido)
		.attr("value", contenido);
	//Se manda una notificación de que se guardo el simulador inicial
	$("#tmpJsonC").text("");
	$("#tmpJsonC").append(
		"<h1 style='color:green;'>Simulador inicial guardado</h1>");

	console.log(contenido);
};

var initEventstextsim = function() {
	console.warn("inicia eventos prcesador de textos");
	//evento para el submit de las respuestas, prevenir el olvidadar guardar,
	//en la prueba se encontraron 3 forms, se hace el guardado 3 veces, buscar como solucionarlo
	//una opcion es saber el identificador exacto de las formas donde se generan los cuestionarios
	//y mandar el selector solo para los botones de dentro
	$('form').on("submit", function(e) {
		e.stopPropagation();

		$(".answerGenerate.textSim").trigger("click");

		return true;
	});

	//Boton para guardar el simulador inicial
	$('#bDuplica').on('click', function() {
		//se obtiene el contenido de la caja del simulador inicial
		sInitSim(1);
	});

	//Boton generar respuestas
	$('#bResult').on('click', function() {
		openTable = false;
		if ($("#id_initsim").val().length <= 0) {
			//guardar antes de modificar algo el simulador inicial si no se ha guardado aún
			sInitSim(0);
		};

		styleArr = [];
		console.warn("Se guardo una respuesta.");

		var attoedit = $("#fitem_id_textosAtto2 div[role=textbox]");
		var jS = attoedit.html();

		//console.log(jS);


		//console.warn("antes = " + attoedit.children().length);
		//console.warn("----IS----");
		//quitar los br	 y los elementos vacios

		attoedit.find("p,b,i,span").each(function(a, b) {
			var newText = $(b).text().replace(/ /g, "");
			if (newText.length <= 0) {
				$(b).remove();
			};
		});

		attoedit.find("br, p:empty, b:empty, i:empty, span:empty").remove();

		//EMPEZAR A GENERAR LA RESPUESTA
		//recorrer el arreglo para homologar y sacar heredar los estilos
		attoedit.children().each(function(i, element) {
			tagName = $(element).prop("tagName");
			tmpFamily = "";
			//tmpElement es el elemento actual y queda como referencia para saber en donde se iniciaran a pegar los hijos
			tmpElement = $(element);
			tmpElement.attr("family", "");
			tmpElement.attr("familyStyle", "");

			//para prevenir errores se añade el atributo style vacio al elemento si no lo tiene
			if ($(element).attr("style") == undefined) {
				$(element).attr("style", "");
			};

			switch (tagName) {
				case "P":
				case "SPAN":
					if ($(element).children().length > 0) {
						childUp($(element));
					};
					break;
				case "B":
					if ($(element).children().length > 0) {
						//se pide el atributo estilo, si no existe se crea
						if ($(element).attr("style") == undefined) {
							console.warn("el primer elemento no tiene estilo");
							$(element).attr("style", "font-weight: bold; ");
						} else { //si existe se añade el italic
							$(element).attr("style", $(element).attr("style") +
								" font-weight: bold;");
						}
						childUp($(element));
					};
					break;
				case "I":
					if ($(element).children().length > 0) {
						//se pide el atributo estilo, si no existe se crea
						if ($(element).attr("style") == undefined) {
							console.warn("el primer elemento no tiene estilo");
							$(element).attr("style", "font-style: italic; ");
						} else { //si existe se añade el italic
							$(element).attr("style", $(element).attr("style") +
								" font-style: italic;");
						}
						childUp($(element));
					};
					break;
				case "TABLE":
					//console.warn("Etiqueta: " + tagName);
					childUpTable($(element));
					break;
				default:
					console.warn("No se contemplo " + tagName + " como etiqueta");
			}
		});

		//console.log($("#fitem_id_textosAtto2 div[role=textbox]").html());

		//se eliminan los elementos vacios de nuevo, ahora son los hijos directos del atto, ya que se vaciron sus hijos como descendientes directos del atto
		attoedit.find("br, p:empty, b:empty, i:empty, span:empty").remove();

		//ya que se homologarón los elementos del editor se recorren nuevamente para sacar el arreglo de estilos
		attoedit.children().each(function(i, element) {
			//console.log($(element));
			tagName = $(element).prop("tagName");
			//console.warn($(element).text().replace(/ /g,"") + "-" + $(element).text().length+ "||" + $(element).attr("style")+"-"+$(element).attr("style").length);
			//si tiene estilo o es tabala[para marcar el final de la misma]
			if ($(element).attr("style").length > 0) {
				//console.log($(element).attr("class"));
				styleArr.push([$(element).attr("style"), $(element).text(), "|" + $(
					element).prop("tagName") + "|", $(element).attr("class")]);
			};
		});
		//arreglo de estilos
		//console.log(styleArr);
		answerString = "";
		//cuenta cuantas respuestas hay hasta respActuales
		respActuales = $('.rT').length;
		console.warn(respActuales);

		var fechaX = new Date();
		var respId = fechaX.getDay() + fechaX.getMonth() + fechaX.getFullYear() +
			fechaX.getHours() + fechaX.getMinutes() + fechaX.getSeconds();

		//console.log(respId);
		//console.log(fechaX.getDay()+fechaX.getSeconds());

		//Añade una nueva respyes
		var newAnsw = $('<div class="rT" data-aris="' + ("aris" + respId + "_" + (
				fechaX.getDay() + fechaX.getSeconds())) + '"><h4 id="resp' + (
				respActuales) +
			'">Saltos de parrafo o cambios de estilo detectados:</h4><ol class="ansPreCont"></ol><p class="eraseAnsw">Eliminar</p></div>'
		);
		var respPrev = $('.contPrevAnsw.textSim').append(newAnsw);

		for (var i = 0; i < styleArr.length; i++) {
			formatStyle(styleArr[i]);
		};
		//console.log($("#id_answer_0").parent());

		// FIN DE CONSTRUIR LA RESPUESTA

		console.log(answerString);


		//answerString = "Generando respuesta.... Nope"


		// Le quita el "<" para guardarlo en la base de datos
		//console.warn("----IS----");
		//console.log(jS);
		var contenido = jS.replace(/</g, "|-|")
		rPrevias = respPrev.html().replace(/</g, "|-|");

		//Guardando en la base de datos de moodle
		$('#id_resultsim')
			.text(contenido)
			.attr("value", contenido);

		$('#id_answprev')
			.text(rPrevias)
			.attr("value", rPrevias);

		//console.log(rPrevias);



		/*Llena con las respuestas correctas*/

		var respNew = $(".contPrevAnsw.textSim .rT:last-child").clone().attr(
			"class", "rTT");
		//console.log(respNew);
		//console.warn(respActuales);
		//$("#id_answer_"+respActuales).parent().before(respNew);


		//si hay algo para guardar
		if (answerString.length > 0) {
			if ($("input[name='answer[0]']").val().length > 0) {
				addAnswesField(1, respNew);
			} else { //guardado de la respuesta 0
				$("input[name='answer[0]']").val(answerString); //se actualiza el campo de respuesta
				var fraction = String((Number($("#answCal").val())));
				if (fraction.indexOf(".") == -1) {
					fraction += ".0"
				};
				//se añade el preview a la altura de la respuesta
				var arisOld = $("#id_answer_0").parent().parent().find(".rT, .rTT").attr(
					"data-aris");
				console.warn(arisOld);
				$('[data-aris= "' + arisOld + '"]').remove();

				$("select[name='fraction[0]']").attr("value", fraction).val(fraction);
				$("#id_answer_0").parent().before(respNew);

				//funcion para agregar los eventos y quitarlos
				eventEraseAnsw();
			}
			//answerString[1] = answerString[1].replace(/</g , '|').replace(/>/g , '|')
		};



		//Se restaura el valor que tenia el editor antes de quitar espacios, vacios y dar formato
		//console.log(jS);
		//console.log(attoedit.html());
		attoedit.text("").append(jS);
	});

	//render events
	$('.answerGenerate.textSim').unbind("click").on('click', function() {
		styleArr = [];
		console.warn("Se guardo una respuesta. -> " + $(this).attr("moodleId"));

		var attoId = $(this).attr("moodleId");

		//Question_answereditable viene de la caja que se genero en el render
		var attoedit = document.getElementById(attoId.replace('_', ':') +
			'_answerQuestioneditable');
		attoedit = $(attoedit);
		//console.log(attoedit);
		var jS = attoedit.html();

		attoedit.find("p,b,i,span").each(function(a, b) {
			var newText = $(b).text().replace(/ /g, "");
			if (newText.length <= 0) {
				$(b).remove();
			};
		});

		attoedit.find("br, p:empty, b:empty, i:empty, span:empty").remove();

		//EMPEZAR A GENERAR LA RESPUESTA
		//recorrer el arreglo para homologar y sacar heredar los estilos
		attoedit.children().each(function(i, element) {
			tagName = $(element).prop("tagName");
			tmpFamily = "";
			//tmpElement es el elemento actual y queda como referencia para saber en donde se iniciaran a pegar los hijos
			tmpElement = $(element);
			tmpElement.attr("family", "");
			tmpElement.attr("familyStyle", "");

			//para prevenir errores se añade el atributo style vacio al elemento si no lo tiene
			if ($(element).attr("style") == undefined) {
				$(element).attr("style", "");
			};

			switch (tagName) {
				case "P":
				case "SPAN":
					if ($(element).children().length > 0) {
						childUp($(element));
					};
					break;
				case "B":
					if ($(element).children().length > 0) {
						//se pide el atributo estilo, si no existe se crea
						if ($(element).attr("style") == undefined) {
							console.warn("el primer elemento no tiene estilo");
							$(element).attr("style", "font-weight: bold; ");
						} else { //si existe se añade el italic
							$(element).attr("style", $(element).attr("style") +
								" font-weight: bold;");
						}
						childUp($(element));
					};
					break;
				case "I":
					if ($(element).children().length > 0) {
						//se pide el atributo estilo, si no existe se crea
						if ($(element).attr("style") == undefined) {
							console.warn("el primer elemento no tiene estilo");
							$(element).attr("style", "font-style: italic; ");
						} else { //si existe se añade el italic
							$(element).attr("style", $(element).attr("style") +
								" font-style: italic;");
						}
						childUp($(element));
					};
					break;
				case "TABLE":
					//console.warn("Etiqueta: " + tagName);
					childUpTable($(element));
					break;
				default:
					console.warn("No se contemplo " + tagName + " como etiqueta");
			}
		});

		//console.log($("#fitem_id_textosAtto2 div[role=textbox]").html());

		//se eliminan los elementos vacios de nuevo, ahora son los hijos directos del atto, ya que se vaciron sus hijos como descendientes directos del atto
		attoedit.find("br, p:empty, b:empty, i:empty, span:empty").remove();

		//ya que se homologarón los elementos del editor se recorren nuevamente para sacar el arreglo de estilos
		attoedit.children().each(function(i, element) {
			//console.log($(element));
			tagName = $(element).prop("tagName");
			//console.warn($(element).text().replace(/ /g,"") + "-" + $(element).text().length+ "||" + $(element).attr("style")+"-"+$(element).attr("style").length);
			//si tiene estilo o es tabala[para marcar el final de la misma]
			if ($(element).attr("style").length > 0) {
				//console.log($(element).attr("class"));
				styleArr.push([$(element).attr("style"), $(element).text(), "|" + $(
					element).prop("tagName") + "|", $(element).attr("class")]);
			};
		});
		//arreglo de estilos
		console.log(styleArr);
		answerString = "";

		//sacar el identificador
		var attoId = $(this).attr("moodleId");

		/*Genrerar el preview de la respuesta*/

		//console.log(respId);
		//console.log(fechaX.getDay()+fechaX.getSeconds());

		//Añade una nueva respuesta no genera un aris, usa el moodleid -> attoId
		$('[data-aris="aris_' + attoId + '"]').remove();
		var newAnsw = $('<div class="rTr" data-aris="' + ("aris_" + attoId +
			'"><h4 id="resp_' + attoId +
			'"> Saltos de parrafo o cambios de estilo detectados:</h4><ol class="ansPreCont"></ol></div>'
		));


		for (var i = 0; i < styleArr.length; i++) {
			formatStyle(styleArr[i]);
		};

		// FIN DE CONSTRUIR LA RESPUESTA

		console.log(answerString);


		//Se restaura el valor que tenia el editor antes de quitar espacios, vacios y dar formato
		//console.log(jS);
		//console.log(attoedit.html());
		attoedit.text("").append(jS);


		var jS_respuesta = document.getElementById(attoId.replace('_', ':') +
			'_answer');
		jS_respuesta.value = answerString;
		jS_respuesta.text = answerString;

		console.log(jS_respuesta);

		$(jS_respuesta).before(newAnsw.append(previewRender));
		previewRender = "";

	});

	//render events
	$('.resDefault.textSim').unbind("click").on('click', function(e) {
		console.warn("restaurar procesador de texto");
		//reinicia el contenido de ATTO inicial en el render
		//se toma el valor de la base y se da formato para append
		/*--IS verificar como se guardan las respuestas, posiblemente se necesite un arreglo de respuestas para cuando hay mas
		de un simulador*/
		//questionData = questionData.replace(/\|-\|/g, "<");
		questionData = $(this).attr("restore").replace(/\|-\|/g, "<");
		//se selecciona el contenedor correspondiente
		var attoId = $(this).attr("moodleId");
		//quita la lista de cambois de estilo
		$('[data-aris="aris_' + attoId + '"]').remove();
		var jS_editor = document.getElementById(attoId.replace('_', ':') +
			'_answerQuestioneditable');
		var jS_respuesta = document.getElementById(attoId.replace('_', ':') +
			'_answer');
		//console.log(attoId.replace('_',':')+'_answerQuestioneditable');
		jS_editor = $(jS_editor);
		jS_respuesta = $(jS_respuesta);
		//console.log(jS_respuesta);
		//se reinicia la caja de texto
		jS_editor.text("").append(questionData);
		jS_respuesta.text("").val("");
	});
};

//funcion para agregar los eventos y quitarlos
var eventEraseAnsw = function() {
	$(".eraseAnsw").unbind("click").on("click", function(e) {
		//Preview ID
		var aris = $(this).parent().attr("data-aris");
		//Padre de la respuesta (contiene al rTT)
		var arisParent = $(this).parent().parent();
		//inputs de moodle para la respuesta
		var selectBlock = arisParent.find("select");
		var inputBlock = arisParent.find("input");
		//cambiar el texto y desbloquearlo
		//inputBlock.removeAttr("disabled");
		inputBlock.val("").text("");
		//cambair el selecta a Ninuguno(a)
		selectBlock.attr("value", "0.0").val("0.0");
		//Por ultimo se quita el rTT
		$('[data-aris="' + aris + '"]').remove();
	});

	var respPrev = $('.contPrevAnsw.textSim');
	var rPrevias = respPrev.html().replace(/</g, "|-|");

	$('#id_answprev')
		.text(rPrevias)
		.attr("value", rPrevias);
};

//funcion para vaciar las respuestas en los campos de atto
var addAnswesField = function(newIndex, descAnEle) {
	var appendEle = descAnEle;
	console.log(appendEle);
	//console.log("tratando de crear nueva respuesta con #id = "+newIndex);
	//console.log($("input[name='answer["+newIndex+"]']").val());
	if (String($("input[name='answer[" + newIndex + "]']").val()) == "undefined") {
		alert("necesitas mas campos de respuesta");
		$("#tmpJsonC2").append(
			"<h1>No hay espacio para respuesta. <br> Al agregar mas, los valores de la tabla se borraran</h1>"
		).css("color", "orange");
		setTimeout(function() {
			$("#tmpJsonC2").children().remove();
		}, 6000);
	} else if ($("input[name='answer[" + newIndex + "]']").val().length > 0) {
		console.log("el campo " + newIndex + " esta lleno");
		//se incrementa el indice, se reenvia el previews
		addAnswesField(++newIndex, appendEle);
	} else {
		console.log("tratando de guardar en el campo " + "input[name='answer[" +
			newIndex + "]']");
		if ($("#answCal").attr("value") < 1.0) {
			alert("recuerda que debes tener una respuesta al 100%");
		};

		$("input[name='answer[" + newIndex + "]']").val(answerString).text(
			answerString);
		//var fraction = String((Number($("#answCal").val()))*100);
		var fraction = String((Number($("#answCal").val())));
		if (fraction.indexOf(".") == -1) {
			fraction += ".0"
		};

		$("select[name='fraction[" + newIndex + "]']").attr("value", fraction).val(
			fraction);

		//se añade el preview a la altura de la respuesta
		var arisOld = $("#id_answer_" + newIndex).parent().parent().find(".rT, .rTT")
			.attr("data-aris");
		$('[data-aris= "' + arisOld + '"]').remove();

		$("#id_answer_" + newIndex).parent().before(appendEle);

		//funcion para agregar los eventos y quitarlos
		eventEraseAnsw();

		console.warn(newIndex);

		console.log("Rediz select -> " + String((Number($("#answCal").val()))));
		console.log("select fraction[] -> " + $("select[name='fraction[" + newIndex +
			"]']").val());

		//doAnswPrev();
	}
};
