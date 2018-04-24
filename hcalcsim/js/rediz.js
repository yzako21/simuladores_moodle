/*
  REDIZ - MOPEFI
  rediz.js
  Copyright (cc) 2016 Moguel Pedraza Francisco Isaac
  Programa para la descarga, llenado y manipulación de la información presentada en los elementos que moodle ocupa: Necesario para el plug-in de hoja de cálculo
  desarrollado para Moodle 2.7.
*/

var sheetIndex = 1;
//variable para la manipulación del menu de las hojas de calculo [row,column]
var tdSelected = [null, null];

//bandera para la hoja de calculo que se tiene seleccionada
var currentSheet = 0;

//inicializa el edit_form y el render
var inithcalsim = function() {
	if (render) {
		restoreQuestion();
		checkFormat();
	};
	initEventshcalsim();
};

//transforma el objeto json de php a un arreglo en js para las respuestas
var jsonaAnsw2Array = function(jsonOBJ) {
	var answersArray = [];
	$.each(jsonOBJ, function(index, value) {
		answersArray.push([value.answer, value.fraction, value.feedback]);
	});
	console.log(answersArray);
};

//restaura las tablas guardadas en la base de datos
var restoreSheets = function(ini, res) {

	jsonLoad_ini = jQuery.parseJSON(String(ini));

	var tables_ini = $.sheet.dts.toTables.json(jsonLoad_ini),
		jsonLoad_res = jQuery.parseJSON(String(res)),
		tables_res = $.sheet.dts.toTables.json(jsonLoad_res);

	console.warn("las tablas son:")
	console.log(jsonLoad_res);

	$('#initsim').html(tables_ini).sheet();
	$('#resultsim').html(tables_res).sheet();
};

//carga las visualizaciones de las respuestas previas
var restorePrevAnsw = function(answPreArr) {

	console.log(answPreArr);

	$("div.answPsel").remove();

	//imagenes de respuestas previas
	var arrayANSW = answPreArr.split("---");
	var ans_desYidata;

	//recorre los campos de respuestas de moodle
	$("fieldset#id_answerhdr div.fitem.fitem_fgroup").each(function(n, ele) {
		console.log("respuesta : " + n);
		if ($(ele).find("input").val().length > 0) {
			ans_desYidata = arrayANSW[n].split("|-|");
			if (ans_desYidata[0].length > 0) {
				$("select#id_fraction_" + n).after(
					'<div class="w100 answPsel" id="answCont' + n +
					'"><hr/><img style="margin-right:5%;" src="' + ans_desYidata[1] +
					'"  class="w20 bPop" alt="Imagen previa"><p class="w60"> <b> Descripción: </b><span class="descAnsw">' +
					ans_desYidata[0] +
					'</span></p><!--p class="w60"> <b> Calificación: </b> <span class="calAnsw" frac="' +
					ans_desYidata[2] + '">' + (Number(ans_desYidata[2]) * 100) +
					'%</span></p--><br class="cBoth"><p class="editPrevSheet w20" data-sheet="' +
					ans_desYidata[3] +
					'"> <a href="#simressheet">Editar</a> </p><br class="w100"><p class="erasePrevSheet w20" answIndex="' +
					n + '"> Eliminar </p> <br/></div>');
			};
			//$("select#id_fraction_"+n).after('<p class="eraseAnsw" data-answ="'+n+'">Eliminar</p>');
		} else {
			//console.log("input[name='answer["+n+"]'] -> esta vacio");
		};
	});

	$("#contPrevAnsw").empty();

	//console.log(arrayANSW.length);
	//console.log(arrayANSW);

	//console.warn("PENDIENTE");
	/*if ($("input[name='answer[0]']").val().length == 0) {
		try{
			if ($("input[name='answer[1]']").val().length == 0) {
				arrayANSW="";
			};
		}catch(e){
			console.log(e);
		}
	};*/

	/*for (var i = 0; i < arrayANSW.length; i++) {
		var ans_desYidata = arrayANSW[i].split("|-|");
		//console.log(ans_desYidata);

		if (ans_desYidata[0].length > 0)  {
			$("#contPrevAnsw").append('<div class="w100 answPsel" id="answCont'+i+'"><hr/><img style="margin-right:5%;" src="'+ans_desYidata[1]+'"  class="w20 bPop" alt="Imagen previa"><p class="w60"> <b> Descripción: </b><span class="descAnsw">'+ans_desYidata[0]+'</span></p><p class="w60"> <b> Calificación: </b> <span class="calAnsw" frac="'+ans_desYidata[2]+'">'+(Number(ans_desYidata[2])*100)+'%</span></p><br class="cBoth"><p class="editPrevSheet w20" data-sheet="'+ans_desYidata[3]+'"> <a href="#simressheet">Editar</a> </p><br class="w100"><p class="erasePrevSheet w20" answIndex="'+i+'"> Eliminar </p> <br/></div>');
		};
	};*/

	/*
		reEvent
		se quitan los eventos viejos y se añaden a los elementos nuevos
	*/

	$(".resDefaultForm.hcalcbutton")
		.unbind('click')
		.on('click', function(e) {
			console.warn("limpia la tabla");
			$("#bDuplica").trigger("click");
			//restoreQuestion();
		});

	$(".editPrevSheet")
		.unbind('click')
		.on('click', function() {
			var dataString = String($(this).attr("data-sheet").replace(/'/g, '"'));
			var dataSheet = jQuery.parseJSON(dataString);
			console.log(dataSheet);
			editSheetData(dataSheet);
		});

	$(".erasePrevSheet")
		.unbind('click')
		.on('click', function() {
			//var cAnswPrev ="";
			//cambiar el texto de la respuesta
			$("input[name='answer[" + $(this).attr("answindex") + "]']").attr("value",
				"").text("");
			$("select[name='fraction[" + $(this).attr("answindex") + "]']").val("0.0");

			//actualizar el formato de las imagenes;
			/*
				$('div.answPsel').each(function (index, value){
				  var description = $(this).children().children(".descAnsw").text();
				  var imageData = $(this).children("img").attr('src');
				  var fracCal = $(this).children().children(".calAnsw").attr('frac');
				  var xmlData = $(this).children(".editPrevSheet").attr('data-sheet');

				  cAnswPrev = cAnswPrev + description +"|-|"+imageData+"|-|"+fracCal+"|-|"+xmlData + "---";

				  console.log(description); //[0]
				  //console.log(imageData); //[1]
				  console.log(fracCal); //[2]
				  //console.log(xmlData); //[3]
				});
			*/
			//console.log(cAnswPrev.split("---"));
			//Se actualizan las vistas previas de la pregunta
			//$("#id_answprev").attr("value",cAnswPrev);

			//remover contenedor (pure HTML)
			$("#answCont" + $(this).attr("answindex")).remove();

			//restorePrevAnsw(cAnswPrev);
		});

	$(".bPop").on('click', function() {
		$('#imagePopC').attr('src', $(this).attr('src'));

		$('#popUp').bPopup({
			closeClass: 'closePop',
		});
	});
	/*
		reEvent End
	*/
	var movDiv = $("#prevAns").detach();
	//$("#fitem_id_addanswers").before(movDiv);
	$("#fgroup_id_answeroptions_0").before(movDiv);

	/*$('div.answPsel').each(function (index, value){
		console.log("remove -> #fgroup_id_answeroptions_"+index );
		console.log("remove -> #fitem_id_feedback_"+index);

		var movAnsOp = $("#fgroup_id_answeroptions_"+index).detach();
		var movAnsFeBack = $("#fitem_id_feedback_"+index).detach();

		$(this).before(movAnsOp);
		$(this).before(movAnsFeBack);
	});*/
};

//guarda la respuesta en el campo de respuesta
//si no hay donde guardar envia alerta
var addAnswesField = function(newIndex) {
	//console.log("tratando de crear nueva respuesta con #id = "+newIndex);
	//console.log($("input[name='answer["+newIndex+"]']").val());
	if (String($("input[name='answer[" + newIndex + "]']").val()) == "undefined") {
		//alert("necesitas mas campos de respuesta");
		$("#tmpJsonC2").append(
			"<h1>No hay espacio para respuesta. <br> Al agregar más, los valores de la tabla se borraran</h1>"
		).css("color", "orange");
		setTimeout(function() {
			$("#tmpJsonC2").children().remove();
		}, 6000);
	} else if ($("input[name='answer[" + newIndex + "]']").val().length > 0) {
		console.log("el campo " + newIndex + " esta lleno");
		addAnswesField(++newIndex);
	} else {
		console.log("tratando de guardar en el campo " + "input[name='answer[" +
			newIndex + "]']");
		if ($("#answCal").attr("value") < 1.0) {
			alert("recuerda que debes tener una respuesta al 100%");
		};



		$("input[name='answer[" + newIndex + "]']").val(answerString[0]).text(
			answerString[0]);
		//var fraction = String((Number($("#answCal").val()))*100);
		var fraction = String((Number($("#answCal").val())));
		if (fraction.indexOf(".") == -1) {
			fraction += ".0"
		};

		$("select[name='fraction[" + newIndex + "]']").attr("value", fraction).val(
			fraction);

		console.log("Rediz select -> " + String((Number($("#answCal").val()))));
		console.log("select fraction[] -> " + $("select[name='fraction[" + newIndex +
			"]']").val());

		doAnswPrev();
	}
};

//Actualizar campo de previsualización de respuestas previas
var doAnswPrev = function() {
	var xmlTable = document.getElementById("resultsim");
	html2canvas(xmlTable, {
		onrendered: function(canvas) {

			var jS = $("#resultsim").getSheet();
			var jsonData;
			jsonData = $.sheet.dts.fromTables.json(jS);
			jsonformat = JSON.stringify(jsonData);

			dataImage = canvas.toDataURL('image/png');

			//valida si hay algo escrito en la primera respuesta y segunda respuesta
			//marcara error si hay no hay nada en la 1ra y 2da y si en la tercera
			if ($("input[name='answer[0]']").val().length == 0 && $(
					"input[name='answer[1]']").val().length == 0) {
				arrayANSW = "";
			};

			///////

			var answPrev = "",
				cAnswPrev = "";


			//actualizar el formato de las imagenes;
			$('div.answPsel').each(function(index, value) {
				var description = $(this).children().children(".descAnsw").text();
				var imageData = $(this).children("img").attr('src');
				var fracCal = $(this).children().children(".calAnsw").attr('frac');
				var xmlData = $(this).children(".editPrevSheet").attr('data-sheet');

				cAnswPrev = cAnswPrev + description + "|-|" + imageData + "|-|" +
					fracCal + "|-|" + xmlData + "---";

				//console.log(description); //[0]
				//console.log(imageData); //[1]
				//console.log(fracCal); //[2]
				//console.log(xmlData); //[3]
			});

			//////

			answPrev = cAnswPrev + $("#answDes").val() + "|-|" + dataImage + "|-|" +
				$("#answCal").val() + "|-|" + jsonformat.replace(/"/g, "'");

			$("#id_answprev").attr("value", answPrev);
			//Se limpia la zona de los preview para despues dibujarla
			$("#contPrevAnsw").text("");
			restorePrevAnsw(answPrev);

			$("#tmpJsonC2").append("<h1>Se añadió una respuesta</h1>").css("color",
				"green");

			setTimeout(function() {
				$("#tmpJsonC2").children().remove();
			}, 3000);

		}
	});
};

//reinicia los la tabla inicial en el render
var restoreQuestion = function() {
	console.warn("restaurando la pregunta");
	console.log(currentMoodleId);

	var emptyTable_Obj =
		'<table title="Hoja1"><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr></table>';
	console.log('.preguntaSim[moodleid="' + currentMoodleId + '"]');
	$('.preguntaSim[moodleid="' + currentMoodleId + '"]').text(emptyTable_Obj);

	var jsonLoad_ini = jQuery.parseJSON(questionDataSheet);
	console.log(jsonLoad_ini);

	var tables_ini = $.sheet.dts.toTables.json(jsonLoad_ini);
	//console.log(tables_ini)	;

	$('.preguntaSim[moodleid="' + currentMoodleId + '"]').html(tables_ini).sheet();

	var rMenu = '<p onclick="jQuery.sheet.instance[' + sheetIndex +
		'].controlFactory.addRow(tdSelected[0],false); return false;" title="Insertar fila después de selección"><img alt="Insertar fila después de selección" src="' +
		rootDir +
		'/question/type/hcalcsim/img/addnextR.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].controlFactory.addRow(tdSelected[0], true); return false;" title="Insertar fila antes de selección"> <img alt="Insertar fila antes de selección" src="' +
		rootDir +
		'/question/type/hcalcsim/img/addprevR.png"></p><!--<p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].controlFactory.addRowMulti(); return false;" title="Agregar multiples filas"> <img alt="Agregar multiples filas" src="' +
		rootDir +
		'/question/type/hcalcsim/img/sheet_row_add_multi.png"></p>--><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].deleteRow(); return false;" title="Borrar fila"> <img alt="Borrar fila" src="' +
		rootDir +
		'/question/type/hcalcsim/img/sheet_row_delete.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].controlFactory.addColumn(tdSelected[1],false); return false;" title="Insertar columna después de selección"> <img alt="Insertar columna después de selección" src="' +
		rootDir +
		'/question/type/hcalcsim/img/InsertC_A.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].controlFactory.addColumn(tdSelected[1], true); return false;" title="Insertar columna antes de selección"> <img alt="Insertar columna antes de selección" src="' +
		rootDir +
		'/question/type/hcalcsim/img/InsertC_B.png"></p><!--<p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].controlFactory.addColumnMulti(); return false;" title="Insertar multiples columnas"> <img alt="Insertar multiples columnas" src="' +
		rootDir +
		'/question/type/hcalcsim/img/InsertC_B_multi.png"></p>--><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].deleteColumn(); return false;" title="Borrar columna"> <img alt="Borrar columna" src="' +
		rootDir +
		'/question/type/hcalcsim/img/sheet_col_delete.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellStyleToggle(\'styleBold\'); return false;" title="Bold"> <img alt="Bold" src="' +
		rootDir +
		'/question/type/hcalcsim/img/text_bold.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellStyleToggle(\'styleItalics\'); return false;" title="Italica"> <img alt="Italica" src="' +
		rootDir +
		'/question/type/hcalcsim/img/text_italic.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellStyleToggle(\'styleUnderline\', \'styleLineThrough\'); return false;" title="Subrayado"> <img alt="Subrayado" src="' +
		rootDir +
		'/question/type/hcalcsim/img/text_underline.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellStyleToggle(\'styleLineThrough\', \'styleUnderline\'); return false;" title="Tachar"> <img alt="Tachar" src="' +
		rootDir +
		'/question/type/hcalcsim/img/text_strikethrough.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellStyleToggle(\'styleLeft\', \'styleCenter styleRight\'); return false;" title="Alinear izquierda"> <img alt="Alinear izquierda" src="' +
		rootDir +
		'/question/type/hcalcsim/img/text_align_left.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellStyleToggle(\'styleCenter\', \'styleLeft styleRight\'); return false;" title="Alinear al centro"><img alt="Alinear al centro" src="' +
		rootDir +
		'/question/type/hcalcsim/img/text_align_center.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellStyleToggle(\'styleRight\', \'styleLeft styleCenter\'); return false;" title="Alinear derecha"><img alt="Alinear derecha" src="' +
		rootDir +
		'/question/type/hcalcsim/img/text_align_right.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellUndoable.undoOrRedo(true); return false;" title="Deshacer"><img alt="Deshacer" src="' +
		rootDir +
		'/question/type/hcalcsim/img/Undo.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellUndoable.undoOrRedo(false); return false;" title="Rehacer"><img alt="Rehacer" src="' +
		rootDir +
		'/question/type/hcalcsim/img/Redo.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].merge(); return false;" title="Unir celdas"><img alt="Unir celdas" src="' +
		rootDir +
		'/question/type/hcalcsim/img/merge_cells_icon.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].unmerge(); return false;" title="Separar celdas"><img alt="Separar celdas" src="' +
		rootDir +
		'/question/type/hcalcsim/img/unmerge_cells_icon.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].sort(true); return false" title="Orden ascendente "><img alt="Orden ascendente" src="' +
		rootDir +
		'/question/type/hcalcsim/img/OrdenaA-Z.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].sort(); return false" title="Orden descendente"><img alt="Orden descendente" src="' +
		rootDir + '/question/type/hcalcsim/img/OrdenaZ-A.png"></p>';
	$(".inlineMenu div").text("");
	$(".inlineMenu div").append(rMenu);
	sheetIndex++;

	//redefinir el evento para la celda seleccionada
	$("td").unbind('click').on('click', function() {
		var row_index = $(this).parent().index();
		var col_index = $(this).index();
		console.log("row -> " + row_index + " col ->" + col_index);
		console.log(tdSelected);
		//row -> 0 col -> 0);
		tdSelected = [$(this).parent().index(), $(this).index()];
		console.log("--------");
		console.log(tdSelected);
	});
};

//Crea una nueva tabla para el resultado a editar del preview
//recibe el Objeto JSON
var editSheetData = function(prevAnsData) {
	var emptyTable_Obj =
		'<table title="Hoja1"><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr></table>';
	$("#resultsim").text(emptyTable_Obj);


	var tables_ini = $.sheet.dts.toTables.json(prevAnsData);
	console.log(tables_ini);

	$("#resultsim").html(tables_ini).sheet();

	$(".inlineMenu div").text("");
	sheetIndex++;

	var rMenu = '<p onclick="jQuery.sheet.instance[' + sheetIndex +
		'].controlFactory.addRow(tdSelected[0],false); return false;" title="Insertar fila después de selección"><img alt="Insertar fila después de selección" src="' +
		rootDir +
		'/question/type/hcalcsim/img/addnextR.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].controlFactory.addRow(tdSelected[0], true); return false;" title="Insertar fila antes de selección"> <img alt="Insertar fila antes de selección" src="' +
		rootDir +
		'/question/type/hcalcsim/img/addprevR.png"></p><!--<p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].controlFactory.addRowMulti(); return false;" title="Agregar multiples filas"> <img alt="Agregar multiples filas" src="' +
		rootDir +
		'/question/type/hcalcsim/img/sheet_row_add_multi.png"></p>--><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].deleteRow(); return false;" title="Borrar fila"> <img alt="Borrar fila" src="' +
		rootDir +
		'/question/type/hcalcsim/img/sheet_row_delete.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].controlFactory.addColumn(tdSelected[1],false); return false;" title="Insertar columna después de selección"> <img alt="Insertar columna después de selección" src="' +
		rootDir +
		'/question/type/hcalcsim/img/InsertC_A.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].controlFactory.addColumn(tdSelected[1], true); return false;" title="Insertar columna antes de selección"> <img alt="Insertar columna antes de selección" src="' +
		rootDir +
		'/question/type/hcalcsim/img/InsertC_B.png"></p><!--<p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].controlFactory.addColumnMulti(); return false;" title="Insertar multiples columnas"> <img alt="Insertar multiples columnas" src="' +
		rootDir +
		'/question/type/hcalcsim/img/InsertC_B_multi.png"></p>--><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].deleteColumn(); return false;" title="Borrar columna"> <img alt="Borrar columna" src="' +
		rootDir +
		'/question/type/hcalcsim/img/sheet_col_delete.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellStyleToggle(\'styleBold\'); return false;" title="Bold"> <img alt="Bold" src="' +
		rootDir +
		'/question/type/hcalcsim/img/text_bold.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellStyleToggle(\'styleItalics\'); return false;" title="Italica"> <img alt="Italica" src="' +
		rootDir +
		'/question/type/hcalcsim/img/text_italic.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellStyleToggle(\'styleUnderline\', \'styleLineThrough\'); return false;" title="Subrayado"> <img alt="Subrayado" src="' +
		rootDir +
		'/question/type/hcalcsim/img/text_underline.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellStyleToggle(\'styleLineThrough\', \'styleUnderline\'); return false;" title="Tachar"> <img alt="Tachar" src="' +
		rootDir +
		'/question/type/hcalcsim/img/text_strikethrough.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellStyleToggle(\'styleLeft\', \'styleCenter styleRight\'); return false;" title="Alinear izquierda"> <img alt="Alinear izquierda" src="' +
		rootDir +
		'/question/type/hcalcsim/img/text_align_left.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellStyleToggle(\'styleCenter\', \'styleLeft styleRight\'); return false;" title="Alinear al centro"><img alt="Alinear al centro" src="' +
		rootDir +
		'/question/type/hcalcsim/img/text_align_center.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellStyleToggle(\'styleRight\', \'styleLeft styleCenter\'); return false;" title="Alinear derecha"><img alt="Alinear derecha" src="' +
		rootDir +
		'/question/type/hcalcsim/img/text_align_right.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellUndoable.undoOrRedo(true); return false;" title="Deshacer"><img alt="Deshacer" src="' +
		rootDir +
		'/question/type/hcalcsim/img/Undo.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellUndoable.undoOrRedo(false); return false;" title="Rehacer"><img alt="Rehacer" src="' +
		rootDir +
		'/question/type/hcalcsim/img/Redo.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].merge(); return false;" title="Unir celdas"><img alt="Unir celdas" src="' +
		rootDir +
		'/question/type/hcalcsim/img/merge_cells_icon.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].unmerge(); return false;" title="Separar celdas"><img alt="Separar celdas" src="' +
		rootDir +
		'/question/type/hcalcsim/img/unmerge_cells_icon.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].sort(true); return false" title="Orden ascendente "><img alt="Orden ascendente" src="' +
		rootDir +
		'/question/type/hcalcsim/img/OrdenaA-Z.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].sort(); return false" title="Orden descendente"><img alt="Orden descendente" src="' +
		rootDir + '/question/type/hcalcsim/img/OrdenaZ-A.png"></p>';
	$(".inlineMenu div").append(rMenu);

	//redefinir el evento para la celda seleccionada
	$("td").unbind('click').on('click', function() {
		var row_index = $(this).parent().index();
		var col_index = $(this).index();
		console.log("row -> " + row_index + " col ->" + col_index);
		console.log(tdSelected);
		//row -> 0 col -> 0);
		tdSelected = [$(this).parent().index(), $(this).index()];
		console.log("--------");
		console.log(tdSelected);
	});
};

var editSheetData2 = function(attr, prevAnsData) {
	var emptyTable_Obj =
		'<table title="Hoja1"><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr></table>';
	$("#resultsim").text(emptyTable_Obj);


	var tables_ini = $.sheet.dts.toTables.json(prevAnsData);
	console.log(tables_ini);

	$("#resultsim").html(tables_ini).sheet();

	$(".inlineMenu div").text("");
	sheetIndex++;

	var rMenu = '<p onclick="jQuery.sheet.instance[' + sheetIndex +
		'].controlFactory.addRow(tdSelected[0],false); return false;" title="Insertar fila después de selección"><img alt="Insertar fila después de selección" src="' +
		rootDir +
		'/question/type/hcalcsim/img/addnextR.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].controlFactory.addRow(tdSelected[0], true); return false;" title="Insertar fila antes de selección"> <img alt="Insertar fila antes de selección" src="' +
		rootDir +
		'/question/type/hcalcsim/img/addprevR.png"></p><!--<p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].controlFactory.addRowMulti(); return false;" title="Agregar multiples filas"> <img alt="Agregar multiples filas" src="' +
		rootDir +
		'/question/type/hcalcsim/img/sheet_row_add_multi.png"></p>--><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].deleteRow(); return false;" title="Borrar fila"> <img alt="Borrar fila" src="' +
		rootDir +
		'/question/type/hcalcsim/img/sheet_row_delete.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].controlFactory.addColumn(tdSelected[1],false); return false;" title="Insertar columna después de selección"> <img alt="Insertar columna después de selección" src="' +
		rootDir +
		'/question/type/hcalcsim/img/InsertC_A.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].controlFactory.addColumn(tdSelected[1], true); return false;" title="Insertar columna antes de selección"> <img alt="Insertar columna antes de selección" src="' +
		rootDir +
		'/question/type/hcalcsim/img/InsertC_B.png"></p><!--<p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].controlFactory.addColumnMulti(); return false;" title="Insertar multiples columnas"> <img alt="Insertar multiples columnas" src="' +
		rootDir +
		'/question/type/hcalcsim/img/InsertC_B_multi.png"></p>--><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].deleteColumn(); return false;" title="Borrar columna"> <img alt="Borrar columna" src="' +
		rootDir +
		'/question/type/hcalcsim/img/sheet_col_delete.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellStyleToggle(\'styleBold\'); return false;" title="Bold"> <img alt="Bold" src="' +
		rootDir +
		'/question/type/hcalcsim/img/text_bold.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellStyleToggle(\'styleItalics\'); return false;" title="Italica"> <img alt="Italica" src="' +
		rootDir +
		'/question/type/hcalcsim/img/text_italic.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellStyleToggle(\'styleUnderline\', \'styleLineThrough\'); return false;" title="Subrayado"> <img alt="Subrayado" src="' +
		rootDir +
		'/question/type/hcalcsim/img/text_underline.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellStyleToggle(\'styleLineThrough\', \'styleUnderline\'); return false;" title="Tachar"> <img alt="Tachar" src="' +
		rootDir +
		'/question/type/hcalcsim/img/text_strikethrough.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellStyleToggle(\'styleLeft\', \'styleCenter styleRight\'); return false;" title="Alinear izquierda"> <img alt="Alinear izquierda" src="' +
		rootDir +
		'/question/type/hcalcsim/img/text_align_left.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellStyleToggle(\'styleCenter\', \'styleLeft styleRight\'); return false;" title="Alinear al centro"><img alt="Alinear al centro" src="' +
		rootDir +
		'/question/type/hcalcsim/img/text_align_center.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellStyleToggle(\'styleRight\', \'styleLeft styleCenter\'); return false;" title="Alinear derecha"><img alt="Alinear derecha" src="' +
		rootDir +
		'/question/type/hcalcsim/img/text_align_right.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellUndoable.undoOrRedo(true); return false;" title="Deshacer"><img alt="Deshacer" src="' +
		rootDir +
		'/question/type/hcalcsim/img/Undo.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].cellUndoable.undoOrRedo(false); return false;" title="Rehacer"><img alt="Rehacer" src="' +
		rootDir +
		'/question/type/hcalcsim/img/Redo.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].merge(); return false;" title="Unir celdas"><img alt="Unir celdas" src="' +
		rootDir +
		'/question/type/hcalcsim/img/merge_cells_icon.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].unmerge(); return false;" title="Separar celdas"><img alt="Separar celdas" src="' +
		rootDir +
		'/question/type/hcalcsim/img/unmerge_cells_icon.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].sort(true); return false" title="Orden ascendente "><img alt="Orden ascendente" src="' +
		rootDir +
		'/question/type/hcalcsim/img/OrdenaA-Z.png"></p><p onclick="jQuery.sheet.instance[' +
		sheetIndex +
		'].sort(); return false" title="Orden descendente"><img alt="Orden descendente" src="' +
		rootDir + '/question/type/hcalcsim/img/OrdenaZ-A.png"></p>';
	$(".inlineMenu div").append(rMenu);

	//redefinir el evento para la celda seleccionada
	$("td").unbind('click').on('click', function() {
		var row_index = $(this).parent().index();
		var col_index = $(this).index();
		console.log("row -> " + row_index + " col ->" + col_index);
		console.log(tdSelected);
		//row -> 0 col -> 0);
		tdSelected = [$(this).parent().index(), $(this).index()];
		console.log("--------");
		console.log(tdSelected);
	});
};

//inicializa los eventos del edit_form y del render
var initEventshcalsim = function() {
	console.warn("inicia eventos hcalc");
	/*
		Generales
	*/
	//evento para actualizar la posición de columna y renglon de la celda seleccionada
	$("td").on('click', function() {
		var row_index = $(this).parent().index();
		var col_index = $(this).index();
		console.log("row -> " + row_index + " col ->" + col_index);
		console.log(tdSelected);
		//row -> 0 col -> 0);
		tdSelected = [$(this).parent().index(), $(this).index()];
		console.log("--------");
		console.log(tdSelected);
	});
	//deseleccionar el focus de contenidos editables y agregarselo al sheet actual
	$('.rAdded,  #answDes').on('click', function() {
		$(
			'#id_questiontexteditable, #id_name, #id_defaultmark, #id_generalfeedbackeditable, .editor_atto_content, #answDes'
		).removeClass("isFocused");
		$('text-area.jSInPlaceEdit').remove();
		$("*:not(.jSParent .jSFormula)").blur();
		//console.log(window.getSelection());//.removeAllRanges();
		$(this).focus();

		//console.log("click en el hijo :" + $(this).attr("index_sheet"));

		currentSheet = $(this).attr("index_sheet");

		if (currentSheet == 0) {
			if (!render) {
				jQuery.sheet.instance[1].evt.cellEditAbandon();
				console.warn("no 1, es el render.");
			} else {
				if (render) {
					console.warn("revisar para mas de una pregunta por cuestionario");
				};
			}
		} else {
			jQuery.sheet.instance[0].evt.cellEditAbandon();
		};
	});

	$(".resDefaultForm.hcalcbutton")
		.on('click', function(e) {
			console.warn("limpia la tabla");
		});

	//generar respuestas
	$('#bResult').on('click', function() {
		//console.log("-----------")

		if (!jsonLoad_ini || jsonLoad_ini == "undefined") {
			//alert("no has guardado un simulador inicial");
			saveInitSim();
		};
		//else{
		var jS = $("#resultsim").getSheet();
		var jsonData;
		jsonData = $.sheet.dts.fromTables.json(jS);
		jsonformat = JSON.stringify(jsonData);

		answerString = getTableFormat(jsonData, true);

		$("#id_resultsim").val(jsonformat).text(jsonformat);
		$("#rCont").text(answerString[0]);

		/*Llena con las respuestas correctas*/
		//console.log($("input[name='answer[0]']").val().length);
		if ($("input[name='answer[0]']").val().length > 0) {
			addAnswesField(1);
		} else { //guardado de la respuesta 0
			console.log(answerString);
			$("input[name='answer[0]']").val(answerString[0]).text(answerString[0]); //se actualiza el campo de respuesta
			var fraction = String((Number($("#answCal").val())));

			if (fraction.indexOf(".") == -1) {
				fraction += ".0"
			};

			$("select[name='fraction[0]']").attr("value", fraction).val(fraction);

			console.log("Rediz select -> " + String((Number($("#answCal").val()))));
			console.log("select fraction[] -> " + $("select[name='fraction[0]']").val());

			doAnswPrev(); //se actualizan los pre
		}

		//$("#rGeneradas").show();
		answerString[1] = answerString[1].replace(/</g, '|').replace(/>/g, '|')
		$("#id_restsim").val(answerString[1]);
		//}


	});

	//parche para el error del selector :focus en jquery que no funciona en firefox
	$(
		'#id_questiontexteditable, #id_name, #id_defaultmark, #id_generalfeedbackeditable, .editor_atto_content, #answDes'
	).on("click", function() {
		//console.log($(this).attr("id"));
		$(
			'#id_questiontexteditable, #id_name, #id_defaultmark, #id_generalfeedbackeditable, .editor_atto_content, #answDes'
		).removeClass("isFocused");
		$(this).addClass("isFocused");
	});

	//lanzar el popup del preview de la respuesta
	$(".bPop").on('click', function() {
		$('#imagePopC').attr('src', $(this).attr('src'));

		$('#popUp').bPopup({
			closeClass: 'closePop',
		});
	});

	//boton para guardar el simulador inicial
	$('#bDuplica').on('click', function() {
		saveInitSim();
	});

	$('.resDefault.hcalcbutton').on('click', function(e) {
		questionDataSheet = $(this).attr("restaurar hoja de cálculo");
		currentMoodleId = $(this).attr("moodleid");
		console.warn(currentMoodleId + " ->  hcalcbutton");
		restoreQuestion();
	});

	//render events
	$('.answerGenerate.hcalcbutton, input[name=next]').on('click', function() {
		console.warn("Genera respuesta de hcalc");
		currentMoodleId = $(this).attr("moodleid");
		var jS = $('.preguntaSim[moodleid="' + currentMoodleId + '"]').getSheet();
		console.log('.preguntaSim[moodleid="' + currentMoodleId + '"]');
		var jsonData;
		jsonData = $.sheet.dts.fromTables.json(jS);
		console.log(jsonData);
		answerString = getTableFormat(jsonData, false);

		$('.answer input[name="' + currentMoodleId.replace("_", ":") + '_answer"]')
			.attr("value", answerString).text(answerString);

		checkFormat();

		console.log("la respuesta tiene el valor de -> " + $(
			'.answer input[name="' + currentMoodleId.replace("_", ":") +
			'_answer"]').attr("value"));
	});
};

//actualiza el campo de simulador inicial
var saveInitSim = function() {
	var jS = $("#initsim").getSheet();
	var jsonData;
	jsonData = $.sheet.dts.fromTables.json(jS);
	jsonformat = JSON.stringify(jsonData);

	//el inicial es el que se define al guardar el simulador con el boton
	jsonLoad_ini = jsonData;

	$("#id_initsim").val(jsonformat);

	$("#tmpJsonC").text("");
	$("#tmpJsonC").append(
		"<h1 style='color:green;'>Se guardó la vista inicial de la tabla</h1>");

	editSheetData(jsonData);
};

//generar el string final
var getTableFormat = function(tableData) {
	var edit_form = render || false; //render || edit_form flag
	//arreglos para los valores no vacios y de referencia a las respuestas
	var arrayIni = getTableArray(jsonLoad_ini) //arreglo en formato de respuesta de la tabla inicial
		,
		arrayRes = getTableArray(tableData) //arreglo en formato de respuestas de la tabla final
		,
		stringFin = "" //arreglo en formato de respuestas de la resta de tablas
		,
		stringStatic = "";

	//console.log("ignoring");
	//console.log(restSim);

	//comparador de arreglos y seleccionador de datos
	for (var ri = 0; ri < arrayRes.length; ri++) {
		for (var ci = 0; ci < arrayRes[ri].length; ci++) {
			try {
				if (arrayRes[ri][ci] != arrayIni[ri][ci]) {
					//console.log("valor diferente agregando a la solución")

					var cellCS = arrayRes[ri][ci].split(">");
					cellCS = cellCS[0].replace("<", "");

					if (restSim.indexOf(cellCS) > 0) {
						console.log("ignore -> " + cellCS);
					} else {
						console.log("save -> " + arrayRes[ri][ci]);
						stringFin += arrayRes[ri][ci];
					}
				} else if (arrayRes[ri][ci] == arrayIni[ri][ci] && edit_form) {
					//console.log("valor igual pero dentro de la edit form, agregando a el valor estatico");
					stringStatic += arrayRes[ri][ci];
				} else {
					//console.warn("iguales pero no edit form")
				}
			} catch (err) {
				//console.warn("se agrego una columna y/o fila");
				stringFin += arrayRes[ri][ci];
			}

		};
	};


	stringFin = stringFin.replace(/\*/g, '|M|');
	stringFin = stringFin.toUpperCase();

	if (!edit_form) {
		return [stringFin, stringStatic];
	} else {
		return stringFin;
	}
};

var checkFormat = function() {

	var string = "null";
	console.warn(currentMoodleId + " checkFormat");


	if (String($("div.responsehistoryheader tr.r1 td.c2").parent().attr("class")) !=
		"undefined") {
		console.log("revisión");
		var answData = "";

		string = $("div.rightanswer").text().replace("La respuesta correcta es: ",
			"");
		answData = dropTableArray(string);
		$("div.rightanswer").text("");
		$("div.rightanswer").append("<p>La respuesta correcta es: </p>")
		for (var i = 0; i < answData.length; i++) {
			$("div.rightanswer").append("<p> Celda: " + (num2Let(answData[i].x) + (
					Number(answData[i].y) + 1)) + "<br/> Valor: " + answData[i].val +
				"<br/> Fórmula: " + (answData[i].formula) + "<br/><br/></p>");
		};

		string = $("div.responsehistoryheader tr.r1 td.c2").text().replace(
			"Guardada: ", "");
		answData = dropTableArray(string);
		$("div.responsehistoryheader tr.r1 td.c2").text("");
		$("div.responsehistoryheader tr.r1 td.c2").append("<p>Guardada: </p>")
		for (var i = 0; i < answData.length; i++) {
			$("div.responsehistoryheader tr.r1 td.c2").append("<p> Celda: " + (num2Let(
					answData[i].x) + (Number(answData[i].y) + 1)) + "<br/> Valor: " +
				answData[i].val + "<br/> Fórmula: " + (answData[i].formula) +
				"<br/><br/></p>");
		};
	} else {
		//console.log("es la pregunta");
		string = $('.answer input[name="' + currentMoodleId.replace("_", ":") +
			'_answer"]').val();
		var answData = dropTableArray(string);
		if ($('div.rAdded[moodleid="' + currentMoodleId + '"] div.prevRes').length <=
			0) {
			$('div.rAdded[moodleid="' + currentMoodleId + '"]').append(
				"<div class='prevRes'></div>");
		};

		$('div.rAdded[moodleid="' + currentMoodleId + '"] div.prevRes').text("").append(
			"<p><b>Respuesta Actual: </b></p>")
		for (var i = 0; i < answData.length; i++) {
			$('div.rAdded[moodleid="' + currentMoodleId + '"] div.prevRes').append(
				"<p> Celda: " + (num2Let(answData[i].x) + (Number(answData[i].y) + 1)) +
				"<br/> Valor: " + answData[i].val + "<br/> Fórmula: " + (answData[i].formula) +
				"<br/><br/></p>");
		};
		//alert(1);
	}



};

//funcion para generar el formato de respuesta de una tabla en formato json
function getTableArray(jsonData) {
	var arrayRTmp = [],
		arrayCTmp = [];

	console.log(jsonData);

	var tmpArrayElm = ""; //variable temporal para el almacenamiento de cada celda

	for (var r = 0; r < jsonData[0].rows.length; r++) {
		for (var c = 0; c < jsonData[0].rows[r].columns.length; c++) {
			if (jsonData[0].rows[r].columns[c].value) {
				tmpArrayElm += "<" + r + "-" + c + ">"; //elemento indicador columna renglon no vacio
				tmpArrayElm += "{" + jsonData[0].rows[r].columns[c].value + "}"; //elemento valor no vacio
				if (jsonData[0].rows[r].columns[c].formula) {
					tmpArrayElm += "[" + jsonData[0].rows[r].columns[c].formula + "]"; //elemento formula
				};
				//arrayCTmp.push(tmpArrayElm); //-IS ccambio para las funciones que no aceptaba en mayuscula
				arrayCTmp.push(tmpArrayElm.toUpperCase());
				//console.log(arrayCTmp);
				tmpArrayElm = "";
			};
		};
		arrayRTmp.push(arrayCTmp);
		arrayCTmp = [];
		//console.log(arrayCTmp);
		//console.warn("----");

	};
	return arrayRTmp;
};

function dropTableArray(answerstring) {
	console.log("datos de tabla");
	console.log(answerstring);
	var arrayAnsw = answerstring.split("}");
	var toFill = [];
	for (var i = 0; i < arrayAnsw.length; i++) {
		var tmpCCoord = {};
		var tmpsepCoord = [];
		var formula = "";
		tmpsepCoord = (arrayAnsw[i].substring((arrayAnsw[i].indexOf("<")) + 1,
			arrayAnsw[i].indexOf(">"))).split("-");
		formula = arrayAnsw[i].substring((arrayAnsw[i].indexOf("[")) + 1, arrayAnsw[i]
			.indexOf("]"));
		tmpCCoord.x = tmpsepCoord[1]; //row
		tmpCCoord.y = tmpsepCoord[0]; //column
		tmpCCoord.val = arrayAnsw[i].substring((arrayAnsw[i].indexOf("{")) + 1,
			arrayAnsw[i].length);
		if (String(tmpCCoord.x) != "undefined" && String(tmpCCoord.y) != "undefined" &&
			String(tmpCCoord.val) != "undefined") {
			toFill.push(tmpCCoord);
		};
		if (String(formula) != "undefined" && String(formula) != "") {
			toFill[i - 1].formula = formula;
		} else {
			try {
				toFill[i - 1].formula = "NO FÓRMULA";
			} catch (e) {

			}
		}
	};
	return toFill;
};

/*UTIL*/
function num2Let(num) {
	switch (num) {
		case "0":
			return "A";
		case "1":
			return "B";
		case "2":
			return "C";
		case "3":
			return "D";
		case "4":
			return "E";
		case "5":
			return "F";
		case "6":
			return "G";
		case "7":
			return "H";
		case "8":
			return "I";
		case "9":
			return "J";
		case "10":
			return "K";
		case "11":
			return "L";
		case "12":
			return "M";
		case "13":
			return "N";
		case "14":
			return "O";
		case "15":
			return "P";
		case "16":
			return "Q";
		case "17":
			return "R";
		case "18":
			return "S";
		case "19":
			return "T";
		case "20":
			return "U";
		case "21":
			return "V";
		case "22":
			return "X";
		case "23":
			return "Y";
		case "24":
			return "Z";
	}

	return num;
};
