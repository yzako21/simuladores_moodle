/*
	Rediz MOPEFI
*/

//Constructor _D
function imageEdit(object) {
	this.boss = object.idParent || "isbody";
	//console.log(object);
	if (this.boss == "isbody") {
		document.body.id = "isbody"
		this.w = document.getElementById(this.boss).offsetWidth ||
			object.width ||
			(window.innerWidth || document.body.clientWidth);

		this.h = document.getElementById(this.boss).offsetHeight ||
			object.height ||
			(window.innerHeight || document.body.clientHeight);
	} else {
		/*
		////// SOLO PARA MOODLE
		Se comento para que el lienzo siempre sea de un tamaño sin importar el form_data y el render
		*/
		//console.log($("#"+this.boss));
		this.w = 800; //($("#"+this.boss).width()  > 300) ? $("#"+this.boss).width() : 300;
		this.h = 500; //($("#"+this.boss).height() > 300) ? $("#"+this.boss).height(): 300;
	}

	this.idP = object.singularId || Math.floor((Math.random() * 100) + 1); + "_u";
	$("#" + this.boss).append('<div id="' + this.idP +
			'" class="canvasContent" style="height:' + this.h + 'px"></div>')
		//console.log(document.getElementById(this.boss).offsetWidth);

	//inicializa el canvas u el context 2d
	this.canvas = null;
	this.context = null;
	this.menuCont = null;

	//canvas para guardar el respaldo de la vista antes de las operaciones
	this.baseCanvas = null;
	this.baseContext = null;

	//canvas para ver el resultado despues de las operaciones
	this.previewCanvas = null;
	this.previewContext = null;
	this.previewAct = false;

	this.properties = {
		scaleFactor: [0.01, 1],
		moveDistance: [0, 0],
		degrees: [0.5, 0],
		cropArea: [0, 0],
	};
	//inicializar los parametros de herramientas iniciales
	//this.currentTool = "";
	this.currentTool = "draw";
	this.pixelsAct = [];
	this.currentFigure = ""; //para dibujar figuras se manda el nombre de la figura a la función
	//Hacer funcion para rgba -IS mejora

	this.currentFigSize = 1;

	this.lineWidth = 0; //-IS revisar

	/*iniciar los parametros de dibujo iniciales*/
	this.currentColor = "#000000";
	this.currentBKGColor = "#000000";

	this.currentStroke_Color = "#000000"; //color de linea
	this.currentStrokeSize = 1;
	this.currentFillStyle = '#000000';

	this.currentEraserSize = 10;

	this.reactClick = false; //inicializar la bandera de eventos
	this.initClick;

	this.font = ["Arial", "Verdana", "Times New Roman", "Courier New", "serif",
		"sans-serif"
	]; //arreglo de font disponibles
	this.currentFont = "Calibri"; //font seleccionada
	this.currentFontsize = 18;
	this.currentMessage = "HOLA"

	this.currentTool_act = 1; //bandera para saber si la herramienta es de seguimiento o de click.
	this.preloadedImages = object.imgPreload || {}; //si se tienen imagenes precargadas

	this.layers = [];

	//[tag, name, actBehavior] ==> 0 click, 1 move, 2 doble click
	this.toolsBar = {
		"move": ["li", "Mover", 1],
		"rotate": ["li", "Girar", 1],
		"scale": ["li", "Escalar", 1],
		"crop": ["li", "Cortar", 2],
		"draw": ["li", "Lápiz", 1],
		"figure": [{
				"line": ["li", "Linea", 2],
				"rectangle": ["li", "Rectangulo", 0],
				"circle": ["li", "Circulo", 0]
			},
			"Figuras"
		],
		"eraser": ["li", "Borrador", 1],
		"text": ["li", "Texto", 0] //,
			//path:"span"
			/*"options":[
					  {
						"Stroke_Color":["colorpicker","Color de línea", 0],
						"Color": ["colorpicker","Color", 0],
						//"BKGColor":["colorpicker","Color de fondo", 0]
					  },
					  "Opciones"
					  ]*/
	};

	this.menuOption = {
		"move": [
			["number", "X", " moveX tool_OP"],
			["number", "Y", "moveY tool_OP"] //2

		],
		"rotate": [
			["number", "Grados: ", "rotateX tool_OP"],
		],
		"scale": [
			["select", "Escala: ", ["0.15",
				"0.10", "0.15", "0.25", "0.5", "0.75", "2", "3"
			], "scaleX tool_OP"],
		],
		"crop": [
			["checkbox", "Tamaño fijo: ", "cropZ tool_OP"],
			["number", "Ancho: ", "cropX tool_OP"],
			["number", "Alto: ", "cropY tool_OP"] //2
		],

		"draw": [
			["number", "Grosor", "FigSize"],
			["color", "Color", "Color"] //2

		],
		"text": [
			["text", "Mensaje", "Message"], //1
			["number", "Tamaño", "Fontsize"],
			["select", "Fuente", this.font, "Font"],
			["color", "Color", "Color"]
		],
		"line": [
			["number", "Grosor", "StrokeSize"],
			["color", "Color", "Stroke_Color"] //2

		],
		"rectangle": [
			["number", "T. Figura", "FigSize"], //1
			["color", "Relleno", "Color"],
			["number", "T. Trazo", "StrokeSize"],
			["color", "Linea", "Stroke_Color"] //2

		],
		"circle": [
			["number", "Radio", "FigSize"], //1
			["color", "Relleno", "Color"],
			["number", "T. Trazo", "StrokeSize"],
			["color", "Linea", "Stroke_Color"] //2
		],
		"eraser": [
			["number", "Tamaño", "EraserSize"],
		]

	};

	this.menuBar = {
		"Archivo": [
				[
					"Abrir", "showImageLoad"
				],
				[
					"Guardar", "saveImage"
				]
			]
			/*,
					"Editar":[
						[
							"Abrir","openImage"
						],
						[
							"Guarar","saveImage"
						]
					]*/
	}

	this.undoList = {

	};

	this.redoList = {

	};


	this.create_menuBar();
	this.create_toolsBar(); //crea el menu
	this.create_LoadI_Window();
	//this.create_layer_Window();
	this.createBaseCanvas(this.w, this.h); //crea el canvas de respaldo
	this.createCanvas(this.w, this.h); //Crear el canvas al tamaño definido
	this.create_Option_Menus();
	this.events(); //iniciar los eventos del objeto menu y primer layer
	this.consoleMe(); //Revisar el objeto creado

	this.extraFunctions();


	return this;
};

imageEdit.prototype.exportDataURL = function(layer) {
	var eleCanvasTmp;
	eleCanvasTmp = document.getElementById(layer);
	console.log("trying tp export layer " + layer);
	canvasData = eleCanvasTmp.toDataURL("image/png");
	console.log(canvasData);

	return canvasData;
};


imageEdit.prototype.loadCanvas = function(data) {
	console.warn("se cargo contenido");
	var that = this;
	var img = new Image();
	img.onload = function() {
		/*Prueba para dibujado en un canvas nuevo*/
		that.createCanvas(that.w, that.h);
		that.context.drawImage(this, 0, 0);
	};
	img.src = data;
	image = null;
};

imageEdit.prototype.extraFunctions = function() {
	this.create_SaveI_Window();
};

imageEdit.prototype.create_SaveI_Window = function() {
	var that = this;
	var saveImg = $('<div id="' + this.idP +
		'_guardarImg" class="uiOutside guardarImg hide"> <h3 class="windowTitle">Guardar como:</h3><div class="content"><div class="nombre"><label for="">Nombre: </label><input type="text" name="nameExport"></div><div class="formato">Formato: <label for=""></label><select name="formatSave" id=""><option value="image/png" selected="true">png</option><option value="image/jpeg">jpg</option></select></div><div class="opciones"><div class="png"><label for="">Transparencia:  </label><input type="checkbox" name="alpha" value="si"> </div></div></div><ul class="menuCont"><li class="acLo_Btn saveAIMG">Aceptar</li><li class="acLo_Btn cancelAIMG">Cancelar</li></ul></div></div>'
	);

	console.warn("fusionar los canvas en uno nuevo");

	saveImg.find(".saveAIMG").on("click", function(e) {
		//metodo para guardar una imagen sin exportar directamente de canvas.toDataURL
		$("#" + that.boss + " .guardarImg").addClass("hide");
		//se toman los datos del formulario [nombre, formato y extensión]

		//se fucionana las capas para despues exportarlas;
		var canvas_Save = that.fusionLayers();
		var format = $('[name="formatSave"] option:selected').val();
		//para la casilla de transparencia, para quitar la transparencia se manda guardar como jpg, con extensión png
		if ($('input[name="alpha"]')[0].checked == false) {
			format = "image/jpeg";
		};

		var extension = $('[name="formatSave"] option:selected').text();
		var nameImg = ($('[name="nameExport"]').val() != "") ? $(
			'[name="nameExport"]').val() : "noName";
		console.log(format + " - " + extension);
		//se copia el contenido de la imagen en un link con atributo descargable y se dispara el evento de click
		dowloadLink = $('<a id="dowloadLink" href="' + canvas_Save.toDataURL(
				format) + '" download="' + nameImg + '.' + extension +
			'">Descargar imagen</a>');
		$("body").append(dowloadLink);
		$("body").find('a#dowloadLink')[0].click();
		//se remueve el link de descarga, este se crea, descarga y borra de forma dinamica
		$("a#dowloadLink").remove();
	});

	saveImg.find(".cancelAIMG").on("click", function(e) {
		$("#" + that.boss + " .guardarImg").addClass("hide");
	});

	$("#" + this.boss).append(saveImg);


};

//se crea un canvas para el preview y para el temporal la primera vez, se usa para guardar el imageData _D
// se uso asi porque ya que no se puede usar el getImageData
imageEdit.prototype.createBaseCanvas = function(w, h) {
	var canvas = document.createElement('canvas');
	var parent = $("#" + this.idP);
	parent.append(canvas);
	$(canvas).addClass("tmp_canvas invisible");
	canvas.width = w;
	canvas.height = h;

	$(canvas).css({
		"z-index": -99999, //cuando se crea un nuevo canvas se pone sobre todos los demas
		"position": "absolute",

	});

	this.baseCanvas = canvas;
	this.baseContext = canvas.getContext('2d');

	this.baseContext.mozImageSmoothingEnabled = false;
	this.baseContext.webkitImageSmoothingEnabled = false;
	this.baseContext.msImageSmoothingEnabled = false;
	this.baseContext.imageSmoothingEnabled = false;

	this.baseContext.save();

	canvas = document.createElement('canvas');
	parent.append(canvas);
	$(canvas).addClass("preview_canvas invisible");

	canvas.width = w;
	canvas.height = h;

	$(canvas).css({
		"z-index": 99999, //cuando se crea un nuevo canvas se pone sobre todos los demas
		"position": "absolute",
	});

	this.previewCanvas = canvas;
	this.previewContext = canvas.getContext('2d');

	this.previewContext.mozImageSmoothingEnabled = false;
	this.previewContext.webkitImageSmoothingEnabled = false;
	this.previewContext.msImageSmoothingEnabled = false;
	this.previewContext.imageSmoothingEnabled = false;


	this.previewContext.save();
};

//Funcion que reinicia el canvas base y preview
imageEdit.prototype.resetBaseCanvas = function(w, h) {
	this.baseContext.restore();
	this.baseContext.clearRect(0, 0, this.w, this.h);

	this.previewContext.restore();
	this.previewContext.clearRect(0, 0, this.w, this.h);
};

//Creacion del y attach del canvas _D
imageEdit.prototype.createCanvas = function(w, h) {
	var that = this;

	var canvas = document.createElement('canvas');
	var parent = $("#" + this.idP);

	parent.append(canvas);

	canvas.id = that.idP + "_l_" + that.layers.length;
	canvas.width = w;
	canvas.height = h;

	$(canvas).css({
		"z-index": that.layers.length + 1, //cuando se crea un nuevo canvas se pone sobre todos los demas
		"position": "absolute"
	})

	that.layers.push(canvas.id);
	that.canvas = canvas;
	that.context = canvas.getContext('2d');

	that.context.mozImageSmoothingEnabled = false;
	that.context.webkitImageSmoothingEnabled = false;
	that.context.msImageSmoothingEnabled = false;
	that.context.imageSmoothingEnabled = false;

	//console.log("# layers = "+that.layers.length);
	if (that.layers.length > 1) {
		console.log("Solo creando los eventos del layer");
		that.events(true); //iniciar los eventos solo para el canvas que se creo
	};

	$(".layerControl.layer_" + this.idP).remove();
	this.create_layer_Window();
	this.create_layer_Menu();


	that.context.save(); //se guardan las transformaciones y estados iniciales
};

//creacion de la barra de menu
imageEdit.prototype.create_menuBar = function() {
	var canvasCont = $("#" + this.idP);
	customLog("agregar la barra de menu a " + this.idP);
	var barEle = $('<ul id="' + this.idP +
		'_bar" class="uiOutside menuBar"></ul>');

	console.log(barEle);

	var tmpId_B = this.idP + '_B'; //es el id asociado a la barra del objeto
	var tmp_sub;

	for (key in this.menuBar) {
		console.log(key);
		barEle.append('<li id="' + tmpId_B + key + '" class="bar_option">' + key +
			'<ul class="subBar"></ul></li>')
		tmp_sub = barEle.find('li#' + tmpId_B + key + ' ul.subBar');
		for (var i = 0; i < this.menuBar[key].length; i++) {
			tmp_sub.append('<li class="bar_' + this.idP + ' subBarOption" data-var="' +
					this.menuBar[key][i][1] + '">' + this.menuBar[key][i][0] + '</li>')
				//console.log(this.menuBar[key][i][0]);
				//console.log(this.menuBar[key][i][1]);
		};


	}

	canvasCont.before(barEle);
};

//Crea el menu de acuerdo al arreglo del constructor _D
imageEdit.prototype.create_toolsBar = function() {
	//var parent = document.getElementById(this.boss);
	//var parent = $("#"+this.boss);
	var canvasCont = $("#" + this.idP);

	this.menuCont = document.createElement('ul');
	var option, suboption, text, submenu, special;

	//recorre el arreglo
	for (key in this.toolsBar) {
		if (this.toolsBar[key][0].constructor == Object) { //si tiene submenu
			option = document.createElement("li");
			text = document.createTextNode(this.toolsBar[key][1]);
			option.appendChild(text);
			option.id = key.replace(" ", "");
			option.className = this.idP + " button submenu"
			submenu = document.createElement("ul");
			for (subkey in this.toolsBar[key][0]) {
				text = document.createTextNode(this.toolsBar[key][0][subkey][1]);
				//si es un color picker
				if (this.toolsBar[key][0][subkey][0] == "colorpicker") {
					suboption = document.createElement("li");
					text = document.createTextNode(this.toolsBar[key][0][subkey][1]);
					special = document.createElement("INPUT");
					special.setAttribute("type", "color");
					special.setAttribute("data-act", this.toolsBar[key][0][subkey][2]);
					special.setAttribute("data-do", subkey.replace(" ", ""));
					special.id = this.idP + "_" + subkey.replace(" ", "");
					special.className = this.idP + " button  subM"
					suboption.appendChild(text);
					suboption.appendChild(special);
				} else {
					suboption = document.createElement(this.toolsBar[key][0][subkey][0]);
					suboption.id = this.idP + "_" + subkey.replace(" ", "");
					suboption.className = this.idP + " button  subM"
					suboption.setAttribute("data-act", this.toolsBar[key][0][subkey][2]);
					suboption.setAttribute("data-do", subkey.replace(" ", ""));
					suboption.appendChild(text);

				}
				submenu.appendChild(suboption);
			}
			option.appendChild(submenu);
		} else {
			text = document.createTextNode(this.toolsBar[key][1]);
			option = document.createElement(this.toolsBar[key][0]);
			option.id = this.idP + "_" + key.replace(" ", "");
			option.className = this.idP + " button"
			option.setAttribute("data-act", this.toolsBar[key][2]);
			option.setAttribute("data-do", key.replace(" ", ""));
			//para los tooltip
			//se añade el texto
			option.appendChild(text);
		}
		this.menuCont.appendChild(option); //añade la opcion al menu
	}
	this.menuCont.id = this.idP + "_menu";
	this.menuCont.className = "ieditMenu uiOutside"

	///parent.append(this.menuCont); //añade el menu al contenedor
	canvasCont.before(this.menuCont); //añade el menu al contenedor
};

imageEdit.prototype.create_Option_Menus = function() {
	var parent = $("#" + this.boss);

	//var canvasCont = $("#"+this.idP);

	var menuOp = $('<ul id="" class="Op_' + this.idP +
			' menuOp uiOutside"><li><h3>Opciones</h3></li></ul>'),
		opP = $('<li><span></span><input type=""></li>'),
		opS = $('<li><span></span><select></select></li>'),
		menuTmp, opTmp, inputTmp;

	//recorre el arreglo
	for (key in this.menuOption) {
		//console.log(key + " con opciones:");
		menuTmp = menuOp.clone();
		menuTmp.attr("id", "t_o_" + key);
		for (var i = 0; i < this.menuOption[key].length; i++) {
			if (this.menuOption[key][i][0] != "select") {
				opTmp = opP.clone();
				inputTmp = opTmp.find("input");
				inputTmp.attr({
					"class": this.menuOption[key][i][2],
					"data-var": this.menuOption[key][i][2],
					"type": this.menuOption[key][i][0]
				});
				//si no es un submenu de herramienta
				if (!inputTmp.hasClass("tool_OP")) {
					inputTmp.attr("min", 1);
				};
				if (inputTmp.hasClass("scaleX")) {
					inputTmp.attr("min", -1);
					inputTmp.attr("max", 99);

				};
				if (inputTmp.hasClass("cropX") || inputTmp.hasClass("cropY")) {
					inputTmp.attr("disabled", "true");
				};
				inputTmp.val(this["current" + this.menuOption[key][i][2]]);
			} else {
				opTmp = opS.clone();
				inputTmp = opTmp.find("select");
				inputTmp.attr({
					"class": this.menuOption[key][i][3],
					"data-var": this.menuOption[key][i][3]
				});
				for (var option = 0; option < this.menuOption[key][i][2].length; option++) {
					inputTmp.append('<option value="' + this.menuOption[key][i][2][option] +
						'">' + this.menuOption[key][i][2][option] + '</option>');
				};
			}

			opTmp.find("span").text(this.menuOption[key][i][1])

			menuTmp.append(opTmp);
		};
		//canvasCont.before(menuTmp); //añade el menu al contenedor

		parent.append(menuTmp); //añade el menu al contenedor
	}
};

imageEdit.prototype.create_LoadI_Window = function() {
	var that = this;

	var loadImg = $('<div id="' + this.idP +
			'_buscarImg" class="uiOutside buscarImg"> <h3 class="windowTitle">Abrir</h3><div class="imgElement">   </div><div class="itemDesc"><!--p class="fileName">  <b>Nombre:</b> <span>item</span>  </p--><p class="fileFormat"><b>Formato:</b> <span>item</span>  </p></p><ul class="menuCont"><li class="acLo_Btn open_Op">Aceptar</li><li class="acLo_Btn close_Op">Cancelar</li></ul></div></div>'
		),
		imgElement = $(
			'<figure class="l_Image"><img src="" alt=""><figcaption class="nombre"></figcaption></figure>'
		),
		images = this.preloadedImages,
		tmpElement, tmpDesc;

	//console.log(imgElement);

	for (key in images) {
		//console.log(images[key].src.split("."))
		tmpElement = imgElement.clone();
		tmpElement.find("img").attr({
			"src": images[key].src,
			"alt": images[key].alt
		});
		tmpElement.attr({
			"data-src": key,
			"data-format": images[key].format || "desconocido"
		});
		tmpElement.find(".nombre").text(images[key].nombre || key);
		loadImg.find(".imgElement").append(tmpElement);
	}

	loadImg.append('<input name="upload" class="hide" type="file" id="' + this.idP +
		'_fInput"/>');

	$("#" + this.boss).append(loadImg);

	$("#" + this.boss + " .l_Image").unbind("click").on('click', function() {
		console.log(this);
		$(".iselected").removeClass("iselected");
		$(this).addClass("iselected");

		var windowLoad = $("#" + that.idP + "_buscarImg");

		windowLoad.find(".fileName span").text($(this).data("src"));
		windowLoad.find(".fileFormat span").text($(this).data("format"));
		windowLoad.find(".fileDesc span").text($(this).find("img").attr("alt"));
	});

	$("#" + this.boss + " .acLo_Btn.open_Op").unbind("click").on('click',
		function() {
			customLog("Se va a cargar una imagen", "#BB00BB");
			var sel_Im_src = $("#" + that.boss + " .iselected img").attr("src");
			//deshabilitado el aceptar en el [+] para cargar imagen
			//if (!$(".iselected img").hasClass("uiEle")) {
			that.loadImage(sel_Im_src, that);
			//console.log("#"+that.idP+"_buscarImg");
			$("#" + that.idP + "_buscarImg").hide();
			//}else{
			//	$('#'+that.idP+'_fInput').trigger('click');
			//}
		});


	//se crea el ultimo elemento para añadir una imagen despues de declar los eventos para que no se le añadan
	tmpElement = imgElement.clone();
	tmpElement.find("img").attr({
		//"src":"./img/addImage.png",
		"src": rootDir + "/question/type/imagesim" + "/img/addImage.png",
		"alt": "Subir una imagen",
		"class": "uiEle"
	});

	tmpElement.attr({
		"data-src": "SRC",
		"data-format": "new"
	});

	//se le añade su propio evento para cargar una imagen, solo con click se dispara la ventana de archivos
	tmpElement.unbind("click").on("click", function(e) {
		$('#' + that.idP + '_fInput').trigger('click');
	});

	tmpElement.find(".nombre").text("Subir otra imagen");
	loadImg.find(".imgElement").append(tmpElement);

	$('#' + this.boss + ' input[name="upload"]').on("change", function(e) {
		var reader = new FileReader();
		var dataURL = "";

		//como es una imagen nueva se crea el espacio para mostrar
		$("#" + that.idP + "_buscarImg").find(".imgElement").append($(
			'<figure class="l_Image n_l_image"><img src="" alt=""><figcaption class="nombre"></figcaption></figure>'
		));

		reader.onload = function(e) {
			//se manda a cargar la imagen
			that.loadImage(e.target.result, that, e.target);
			$("#" + that.idP + "_buscarImg").hide();
		}

		//console.log(dataURL);

		reader.readAsDataURL(e.target.files[0]);
		//console.warn("files");
		//console.log(e.target.files[0]);

		//se hace referencia al ultimo elemento creado dentro del buscador de imágenes
		var newImgEle = $("#" + that.idP +
			"_buscarImg .imgElement .n_l_image:last-child");
		newImgEle.attr({
			"data-src": e.target.files[0].name.replace(/.jpg/g, "").replace(/.png/g,
				""),
			"data-format": e.target.files[0].name.substr(-3)
		});
		newImgEle.find(".nombre").text(e.target.files[0].name.replace(/.jpg/g, "")
			.replace(/.png/g, "") || "temp");

	});

	$("#" + this.boss + " .acLo_Btn.close_Op").unbind("click").on('click',
		function() {
			$("#" + that.idP + "_buscarImg").hide();
		});


	$("#" + this.boss + " .l_Image img").each(function(index, element) {
		//console.log(element);
		$(element).attr("height", $(element).width())
	});
};


imageEdit.prototype.showImageLoad = function() {
	$("#" + this.boss + " .iselected").removeClass("iselected");
	$("#" + this.boss + " div.buscarImg").show();
};

imageEdit.prototype.hideImageLoad = function() {
	$("#" + this.boss + " div.buscarImg").hide();
};

//crea la interfaz de manejo de capas
imageEdit.prototype.create_layer_Window = function() {

	//$("#layerControl");

	var that = this;

	var layerList = $('</div><ul class="layer_' + this.idP +
		' layerControl uiOutside" style="max-height:' + (this.h / 2) +
		'px"><li><h2 class="tcenter layerT">Capas </h2><img  class="addLayer" src="' +
		rootDir +
		'/question/type/imagesim/img/addLayer.png" alt="Agregar una nueva capa">  <img class="fusionLayers" src="' +
		rootDir +
		'/question/type/imagesim/img/fusionLayers.png" alt="Fusionar capas visibles"></li></ul>'
	);
	//var layerList = $('<ul class="layerControl uiOutside" style="max-height:'+(this.h/2)+'px"><li><h2 class="tcenter layerT">Capas</h2><img  class="addLayer" src="./img/addLayer.png" alt="Fusionar capas visibles">  <img class="fusionLayers" src="./img/fusionLayers.png" alt="Fusionar capas visibles"></li></ul>');
	for (var i = this.layers.length - 1; i >= 0; i--) {
		layerList.append('<li class=" layer_' + this.idP +
			' i_ed_Layer" data-canvas="' + this.layers[i] +
			'"><p data-visible="true">visible</p><span>Capa ' + (i + 1) +
			'</span><img class="removeLayer" src="' + rootDir +
			'/question/type/imagesim/img/deleteLayer.png" alt="Eliminar esta capa"></li>'
		); //
		//layerList.append('<li class="i_ed_Layer" data-canvas="'+this.layers[i]+'"><p data-visible="true">visible</p><span>Capa '+ (i+1)+'</span><img class="removeLayer" src="./img/deleteLayer.png" alt=""></li>');//
	};

	$("#" + this.boss).append(layerList);
	//añade el elemento de estado para los tooltip de elementos pequeños
	$("#" + this.boss + " #spanTip").remove();
	$("#" + this.boss).append('<div><span id="spanTip">jojojojoj</span>');

	$(".i_ed_Layer.layer_" + this.idP).on("click", function(e) {
		//console.warn("aui vas");
		e.stopPropagation();
		$("#" + that.boss + " .l_Selected").removeClass("l_Selected");
		$(this).addClass("l_Selected");
		that.canvas = document.getElementById($(this).attr("data-canvas"));
		that.context = that.canvas.getContext('2d');
		console.log($(this).attr("data-canvas"));
		//ver si despues es necesario añadir el paso de los click
	});

	$("#" + this.boss + " .i_ed_Layer p").on("click", function(e) {
			e.stopPropagation();
			if ($(this).attr("data-visible") === "true") {
				$(this).attr("data-visible", "false");
				$("#" + $(this).parent().attr("data-canvas")).hide();
			} else {
				$(this).attr("data-visible", "true");
				$("#" + $(this).parent().attr("data-canvas")).show();
			}
		})
		.on('mouseenter', function(e) {
			console.log("enter" + $(this).attr("alt"));
			var elePos = $(this).position();

			var ttip = $("#" + that.boss + " span#spanTip").detach();
			$(this).parent().parent().append(ttip);

			console.log((elePos.left + $(this).width()) + "px");
			console.log((elePos.top - $(this).height()) + "px");

			ttip
				.text($(this).attr("alt"))
				//.css("left",(elePos.left-$(this).parent().width()+($(this).width()/2) )+ "px")
				.css("top", (elePos.top - $(this).height()) + "px")
				.show();

			$("#" + that.boss + " span#spanTip").text("Mostrar/Ocultar Capa");
		})
		.on('mouseout', function(e) {
			//console.log("out"+ $(this).attr("alt"));
			//console.log(this.getAttribute("data-do"));

			$("#" + that.boss + " span#spanTip").text("").hide();

		});

	$("#" + this.boss + " .addLayer").on("click", function(e) {
			e.stopPropagation();
			that.createCanvas(that.w, that.h);

			moodleReact("addLayer");
		})
		.on('mouseenter', function(e) {
			console.log("enter" + $(this).attr("alt"));
			var elePos = $(this).position();

			var ttip = $("#" + that.boss + " span#spanTip").detach();
			$(this).parent().parent().append(ttip);

			console.log((elePos.left + $(this).width()) + "px");
			console.log((elePos.top - $(this).height()) + "px");

			ttip
				.text($(this).attr("alt"))
				//.css("left",(elePos.left-$(this).parent().width()+($(this).width()/2) )+ "px")
				.css("top", (elePos.top - $(this).height()) + "px")
				.show();

			$("#" + that.boss + " span#spanTip").text($(this).attr("Añadir capa"));
		})
		.on('mouseout', function(e) {
			console.log("out" + $(this).attr("alt"));
			$("#" + that.boss + " span#spanTip").text("").hide();
		});

	$("#" + this.boss + " .fusionLayers")
		.on("click", function(e) {
			e.stopPropagation();
			var canvas_Fusion = that.fusionLayers();
			/*
				//-IS_m
				//mejorar para que cuando se haga la fusion se eliminen los que se fusionaron
				customLog("empieza ","#AB3A3A")
				for (var i = that.layers.length-1 ; i > 0; i--) {
					console.warn(that.layers[i]);
					$('li[data-canvas="'+that.layers[i]+'"]').remove();
					that.removeCanvas(that.layers[i]);
					console.log('li[data-canvas="'+that.layers[i]+'"]');
				};

				that.canvas = document.getElementById(that.layers[0]);
				that.context = that.canvas.getContext('2d');
			*/
			that.createCanvas(that.w, that.h);
			that.context.drawImage(canvas_Fusion, 0, 0);

			moodleReact("fusionLayers");

		})
		.on('mouseenter', function(e) {
			console.log("enter" + $(this).attr("alt"));
			var elePos = $(this).position();

			var ttip = $("#" + that.boss + " span#spanTip").detach();
			$(this).parent().parent().append(ttip);

			console.log((elePos.left + $(this).width()) + "px");
			console.log((elePos.top - $(this).height()) + "px");

			ttip
				.text($(this).attr("alt"))
				//.css("left",(elePos.left-$(this).parent().width()+($(this).width()/2) )+ "px")
				.css("top", (elePos.top - $(this).height()) + "px")
				.show();

			$("#" + that.boss + " span#spanTip").text($(this).attr("alt"));
		})
		.on('mouseout', function(e) {
			console.log("out" + $(this).attr("alt"));
			//console.log(this.getAttribute("data-do"));
			$("#" + that.boss + " span#spanTip").text("").hide();
		});

	$("#" + this.boss + " .removeLayer")
		.on("click", function(e) {
			e.stopPropagation();
			if (that.layers.length > 1) {
				that.removeCanvas($(this).parent().attr("data-canvas"));
				$(this).parent().remove();
			} else {
				that.canvas = document.getElementById(that.layers[0]);
				that.context = that.canvas.getContext('2d');
				that.context.clearRect(0, 0, that.w, that.h);
			}
			moodleReact("removeLayer");
		})
		.on('mouseenter', function(e) {
			console.log("enter" + $(this).attr("alt"));

			var elePos = $(this).position();

			var ttip = $("#" + that.boss + " span#spanTip").detach();
			$(this).parent().parent().append(ttip);

			console.log((elePos.left + $(this).width()) + "px");
			console.log((elePos.top - $(this).height()) + "px");

			ttip
				.text($(this).attr("alt"))
				//.css("left",(elePos.left-$(this).parent().width()+($(this).width()/2) )+ "px")
				.css("top", (elePos.top - $(this).height()) + "px")
				.show();


			$("#" + that.boss + " span#spanTip").text($(this).attr("alt"));
		})
		.on('mouseout', function(e) {
			console.log("out" + $(this).attr("alt"));
			//console.log(this.getAttribute("data-do"));
			$("#" + that.boss + " span#spanTip").text("").hide();
		});

	//se selecciona el primero
	$("#" + this.boss + ' .layerControl.layer_' + this.idP + ' li:nth-of-type(2)')
		.addClass("l_Selected");

	customLog("layer window", "#faf")
};

imageEdit.prototype.create_layer_Menu = function() {

	$('#' + this.boss + ' ul.layerMenu.uiOutside').remove();

	console.log(this.layers);
	var that = this;
	var layerMenu = $('<ul class="lm_' + this.idP +
		' layerMenu uiOutside" style="max-height:' + (this.h / 2) +
		'px"><li><p>Opciones Generales: </p></li>	<li><span>Color de fondo: &nbsp;&nbsp;&nbsp; </span><input type="color" id="g_bkgcolor" class="" min="1"></li></ul>'
	);
	var colorBGGG = layerMenu.find('input[type="color"]')

	//console.warn("sacar la lista de layers y cambiarle el fondo a la primera o a la actual");


	$("#" + this.boss).append(layerMenu);

	$("#" + this.boss + " #g_bkgcolor").unbind("change").on("change", function(e) {

		//guarda el estado anterior del canvas antes de la operación
		that.undoList[$(that.canvas).attr("id")] = that.canvas.toDataURL();
		//console.log(that.undoList);

		var img = new Image();
		img.src = that.undoList[$(that.canvas).attr("id")];

		console.log($(this).val());
		var prevCOlor = this.currentColor //salva el color que tenian las herramientas


		that.baseContext.clearRect(0, 0, that.w, that.h);
		that.baseContext.drawImage(that.canvas, 0, 0);
		that.context.clearRect(0, 0, that.w, that.h);
		that.context.fillStyle = $(this).val() //establece el color de fondo
		that.context.fillRect(0, 0, that.w, that.h);

		that.context.drawImage(that.baseCanvas, 0, 0);

		that.context.fillStyle = prevCOlor //establece el color que tenian las herramientas

		//para el cambio de color
		moodleReact("bkgcolor");
	});
};

imageEdit.prototype.removeCanvas = function(idCanvas) {

	customLog("Borrando " + idCanvas, "#4643C1", "#EDF26D");
	$("canvas#" + idCanvas).remove();

	//r_arrayElement(element, array)
	r_arrayElement(idCanvas, this.layers);
	console.log(this.layers);
};

//Eventos del objeto _D
imageEdit.prototype.events = function(onlyCanvas) {
	var that = this;
	//mousedown
	this.canvas.addEventListener('mousedown', function(evt) {
		customLog("Mousedown", "#ABABAA");

		//guarda el estado anterior del canvas antes de la operación
		that.undoList[$(that.canvas).attr("id")] = that.canvas.toDataURL();
		//console.log(that.undoList);

		var img = new Image();
		img.src = that.undoList[$(that.canvas).attr("id")];

		evt.preventDefault();
		evt.stopPropagation();

		var mousePos = that.getMousePos(that.canvas, evt);
		that.savePixels(mousePos);
		that.reactClick = true;
		that.previewAct = true;
		that.initClick = mousePos;

		console.log("mueve lo de la barra");
		console.log($("#" + that.idP + "_bar").height() + $("#" + that.idP +
			"_menu").height());

		if (that.currentTool_act == 2) {
			customLog("Añade rectangulo de selección", "#153DD3");
			$(that.canvas).before('<div class="selectionSquare" style="top:' + (6 + $(
					"#" + that.idP + "_bar").height() + $("#" + that.idP + "_menu").height() +
				that.initClick.y) + 'px;left:' + that.initClick.x + 'px;"></div>');
		}
		//para el recorte de un solo click
		else if (that.currentTool_act == 3) {
			customLog("Añade rectangulo de selección", "#153DD3");
			$(that.canvas).before('<div class="selectionSquare" style="top:' + (6 + $(
					"#" + that.idP + "_bar").height() + $("#" + that.idP + "_menu").height() +
				that.initClick.y) + 'px;left:' + that.initClick.x + 'px;"></div>');

			//se asignan los valores del ancho y el alto tomando el valor de las casillas de opciones de corte
			var selectionSquare = $(that.canvas).parent().find(".selectionSquare");
			var size = {
				wS: $("#" + that.idP).parent().find("input.cropX").val(),
				wH: $("#" + that.idP).parent().find("input.cropY").val()
			}
			selectionSquare.css({
				"width": size.wS,
				"height": size.wH
			});
		};
	}, false);
	//
	//mouseup
	this.canvas.addEventListener('mouseup', function(evt) {
		//console.log("up");
		evt.preventDefault();
		evt.stopPropagation();

		var mousePos = that.getMousePos(that.canvas, evt);
		if (that.reactClick && that.currentTool_act == 0) {
			that.doReact(mousePos);
		} else if (that.reactClick && that.currentTool_act == 2) {
			that.savePixels(mousePos);
			//console.log(that.pixelsAct);
			that.doReact(that.pixelsAct);
		} else if (that.reactClick && that.currentTool_act == 1) {
			//console.log(that.pixelsAct);
			that.previewAct = false;
			that.doReact(that.pixelsAct, false);
		}
		//para el corte con un solo click y de un tamaño especifico
		else {
			var pFinal = {
					x: mousePos.x + Number($("#" + that.boss + " ." + that.currentTool +
						"X").val()),
					y: mousePos.y + Number($("#" + that.boss + " ." + that.currentTool +
						"Y").val())
				}
				//se manda de cordenada el tamaño que se tiene mas el punto inicial donde se dio click
			that.savePixels(pFinal);
			that.doReact(that.pixelsAct);
		}
		customLog("Remueve rectangulo de selección", "#CA8C06");
		$(".selectionSquare").remove();
		that.resetBaseCanvas();
		that.reactClick = false;



	}, false);
	//
	//mousemove
	this.canvas.addEventListener('mousemove', function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		//console.log(that.reactClick);
		//that.context.clearRect(0, 0, that.canvas.width, that.canvas.height);
		var mousePos = that.getMousePos(that.canvas, evt);
		//var message = 'Pos: ' + mousePos.x + ',' + mousePos.y;
		//that.writeMessage(that.canvas, message, {x: mousePos.x, y:mousePos.y});
		//console.log(that.reactClick + " && "+  that.currentTool_act );
		if (that.reactClick && that.currentTool_act == 1) {
			that.doReact(mousePos);
		} else if (that.reactClick && that.currentTool_act == 2) {
			//para el recuadro de selección
			//customLog("cambia tamaño preview de seleccion", "#17D524");
			var selectionSquare = $(that.canvas).parent().find(".selectionSquare");
			var size = {
				wS: that.initClick.x - mousePos.x > 0 ? that.initClick.x - mousePos.x : mousePos
					.x - that.initClick.x,
				wH: that.initClick.y - mousePos.y > 0 ? that.initClick.y - mousePos.y : mousePos
					.y - that.initClick.y
			}

			if (mousePos.x - that.initClick.x < 0 && mousePos.y - that.initClick.y <
				0) {
				selectionSquare.css({
					"top": 6 + $("#" + that.idP + "_bar").height() + $("#" + that.idP +
						"_menu").height() + mousePos.y,
					"left": mousePos.x
				});
				//$(".selectionSquare").addClass("rotateXY");
			} else if (mousePos.x - that.initClick.x < 0) {
				selectionSquare.css({
					"left": mousePos.x
				});
				//$(".selectionSquare").addClass("rotateX");
			} else if (mousePos.y - that.initClick.y < 0) {
				selectionSquare.css({
					"top": 6 + $("#" + that.idP + "_bar").height() + $("#" + that.idP +
						"_menu").height() + mousePos.y,
				});
				//$(".selectionSquare").addClass("rotateY");
			}

			selectionSquare.css({
				"width": size.wS,
				"height": size.wH
			});
			//that.initClick -> se registra cuando ocurre el evento click en el canvas
			//console.log(mousePos);
			//console.log(that.initClick);
		}
		//para el recorte de un click
		else if (that.reactClick && that.currentTool_act == 3) {
			that.resetPixels();
			that.savePixels(mousePos);
			//customLog("cambia tamaño preview de seleccion", "#17D524");
			var selectionSquare = $(that.canvas).parent().find(".selectionSquare");
			selectionSquare.css({
				"top": 6 + $("#" + that.idP + "_bar").height() + $("#" + that.idP +
					"_menu").height() + mousePos.y,
				"left": mousePos.x
			});
		}
	}, false);
	//


	//eventos no para canvas
	if (!onlyCanvas) {
		//submenu
		var menuButtons = document.querySelectorAll("." + this.idP + ".button");
		for (var menuEle = 0; menuEle < menuButtons.length; menuEle++) {
			if (menuButtons[menuEle].className.indexOf("submenu") != -1) {
				menuButtons[menuEle].addEventListener('click', function(evt) { //para los submenu
					evt.stopPropagation();
					console.log($(this))
					if ($(this).hasClass("submenu")) {
						$(this).hasClass("desplegado") ? $(this).removeClass("desplegado") : $(
							this).addClass("desplegado");
					} else {
						$(".desplegado").removeClass("desplegado");
					}

				});
			} else {
				menuButtons[menuEle].addEventListener('click', function(evt) { //para los menu
					evt.stopPropagation();
					console.log(this.getAttribute("data-do"));
					that.currentTool = this.getAttribute("data-do");
					that.currentTool_act = Number(this.getAttribute("data-act"));
					$(".menuOp.Op_" + that.idP).hide();
					$(".desplegado").removeClass("desplegado");
					$(".btn_sel").removeClass("btn_sel");
					$(this).addClass("btn_sel");
					customLog("#t_o_" + that.currentTool, "#09CFDB");
					$("#" + that.boss).attr("datapointer", "pointer_" + that.currentTool);
					//Como las herramientas comparten valores de grosor y color, estas se actualizan en los menus de opciones
					$("#t_o_" + that.currentTool + " input").each(function(index, element) {
						//console.log($(element).val() + " cambiado a " + that["current"+$(element).attr("data-var")]);
						$(element).val(that["current" + $(element).attr("data-var")]);
					});
					$("#" + that.boss + " #t_o_" + that.currentTool).show();
				});
			}

			//agrega el evento mouseenter y mouseout para los tooltip
			menuButtons[menuEle].addEventListener('mouseenter', function(evt) { //para los menu
				//console.log(this.getAttribute("data-do"));
				//console.log($(this).children("text").outerText);
				$("p.tooltip").remove();
				$(this).append('<p class="tooltip">' + $(this).clone().children().remove()
					.end().text() + '</p>');
			});
			menuButtons[menuEle].addEventListener('mouseout', function(evt) { //para los menu
				//console.log(this.getAttribute("data-do"));
				$(this).children("p.tooltip").remove();
			});
		};



		var tmpEle, valChange;
		//eventos para los menus de opciones por herramienta
		$("#" + this.boss + " .menuOp.Op_" + this.idP + " input, #" + this.boss +
			" .menuOp.Op_" + this.idP + " select").each(function(index, element) {
			//console.log("Se cambio -> " + $(this).attr("data-var"));
			tmpEle = $(element);
			if (tmpEle.is('select')) {
				tmpEle.on("change", function(e) {
					valChange = $(this).val();
					that.changeVal("current" + $(this).attr("data-var"), valChange);

					//para hacer el escalado desde el select
					if (that.currentTool == "scale") {
						console.warn("hacer el escalado");
						console.log("#" + that.boss + " ." + that.currentTool + "X");
						if (Number($("#" + that.boss + " ." + that.currentTool + "X").val()) >
							99) {
							$("#" + that.boss + " ." + that.currentTool + "X").val(99);
						};

						//vNuevo = $("#"+that.boss+" ."+that.currentTool+"X").val() - $("#"+that.boss+" ."+that.currentTool+"X")[0].defaultValue;
						if (Number($(that.currentTool + "X").val()) < 0) {
							vNuevo = 1 - $("#" + that.boss + " ." + that.currentTool + "X").val();
						} else {
							vNuevo = $("#" + that.boss + " ." + that.currentTool + "X").val();
						}
						$("#" + that.boss + " ." + that.currentTool + "X").val(0);
						console.log(vNuevo);
						that.properties.scaleFactor[1] = Number(vNuevo);
						that.doReact(vNuevo, false);
					}

				});
			} else if (tmpEle.is('input[type="color"]')) {
				tmpEle.on("change", function(e) {
					valChange = $(this).val();
					that.changeVal("current" + $(this).attr("data-var"), valChange);
				});
			} else if (tmpEle.is('input[type="checkbox"]')) {
				tmpEle.on("change", function(e) {
					if ($(this)[0].checked == true) {
						console.log("tamaño fijo");
						that.currentTool_act = 3
						console.log(that.currentTool_act);
						//cambiar a 0 los valores
						$("#" + that.boss + " ." + that.currentTool + "X, " + "#" + that.boss +
							" ." + that.currentTool + "Y").val(0);
						//habilitar los campos
						$("#" + that.boss + " ." + that.currentTool + "X, " + "#" + that.boss +
							" ." + that.currentTool + "Y").removeAttr("disabled");
					} else {
						console.log("cambiante");
						that.currentTool_act = $("#" + that.idP + "_" + that.currentTool).attr(
							"data-act");
						console.log(that.currentTool_act);
						//cambiar a 0 los valores
						$("#" + that.boss + " ." + that.currentTool + "X, " + "#" + that.boss +
							" ." + that.currentTool + "Y").val(0);
						//deshabilitar los controles
						$("#" + that.boss + " ." + that.currentTool + "X, " + "#" + that.boss +
							" ." + that.currentTool + "Y").attr("disabled", "disabled");
					}

				});
			} else if (tmpEle.is('input[type="number"]')) {
				tmpEle.on("change", function(e) {
					console.log($(this).val());
					valChange = $(this).val();
					if ($(this).hasClass("tool_OP")) {
						//si es una herramienta OP
						var origin = {
							x: 0,
							y: 0
						};
						var moverto = {
							x: 0,
							y: 0
						};

						//para manejar los valores de los input
						var vAnterior, vNuevo;

						console.log(that.currentTool);
						switch (that.currentTool) {
							case "move":
								//valores para saber si disminuyo o decremento
								vAnterior = {
									x: $("#" + that.boss + " ." + that.currentTool + "X")[0].defaultValue,
									y: $("#" + that.boss + " ." + that.currentTool + "Y")[0].defaultValue
								};
								vNuevo = {
									x: $("#" + that.boss + " ." + that.currentTool + "X").val(),
									y: $("#" + that.boss + " ." + that.currentTool + "Y").val()
								};
								if (this.defaultValue > 0 && this.value > 0) {
									moverto.x = vNuevo.x - vAnterior.x;
									moverto.y = vNuevo.y - vAnterior.y;
								}
								//si es negativo -> d
								else {
									moverto.x = vNuevo.x - vAnterior.x;
									moverto.y = vNuevo.y - vAnterior.y;
								}
								that.initClick = origin;
								break;
							case "rotate":
								vNuevo = $("#" + that.boss + " ." + that.currentTool + "X").val() -
									$("#" + that.boss + " ." + that.currentTool + "X")[0].defaultValue;
								that.properties.degrees[1] = vNuevo;
								break;
								/*case "scale":
									console.warn("hacer el escalado");
									if (Number($("#" + that.boss + " ." + that.currentTool + "X").val()) >
										99) {
										$("#" + that.boss + " ." + that.currentTool + "X").val(99);
									};

									//vNuevo = $("#"+that.boss+" ."+that.currentTool+"X").val() - $("#"+that.boss+" ."+that.currentTool+"X")[0].defaultValue;
									if (Number($(that.currentTool + "X").val()) < 0) {
										vNuevo = 1 - $("#" + that.boss + " ." + that.currentTool + "X").val();
									} else {
										vNuevo = $("#" + that.boss + " ." + that.currentTool + "X").val();
									}
									$("#" + that.boss + " ." + that.currentTool + "X").val(0);
									console.log(vNuevo);
									that.properties.scaleFactor[1] = Number(vNuevo);
									break;*/
							case "crop":
								//cambiar el tipo de reaccion a evento que tiene el crop, para solo cortar conun click
								console.log("cambia el tipo de respuesta a 3");
								that.currentTool_act = 3;
								break;
							default:
								console.log("No aplica la herramiena para esta sección")
						}
						this.defaultValue = this.value;
						that.doReact(moverto, false);
					} else {
						that.changeVal("current" + $(this).attr("data-var"), valChange);
					}
				});
				tmpEle.on("change", function(e) {
					valChange = $(this).val();
					that.changeVal("current" + $(this).attr("data-var"), valChange);
				});
			} else {
				tmpEle.on("keyup", function(e) {
					valChange = $(this).val();
					that.changeVal("current" + $(this).attr("data-var"), valChange);
				});
			}
		});


		//eventos de la barra de menu
		var tmpBarE, tmpUlsB;
		$("#" + this.boss + " .menuBar .bar_option").each(function(index, element) {
			$(element).on('click', function(e) {
				$("ul.subBar").hide();
				$(this).children("ul").show();
			});

			tmpUlsB = $(element).children("ul");

			tmpUlsB.on('mouseleave', function(e) {
				$(this).hide();
			});

			tmpUlsB.children("li").on('click', function(e) {
				var opFunction = $(this).attr("data-var")
				console.log($(this).parent());
				console.log(opFunction);
				that[opFunction]();
			});
		});

		//CTRL + Z
		$("body").on("keydown", function(e) {
			if (e.keyCode == 90 && e.ctrlKey) {
				that.undoReact();
			};
		})

	};
};

//funcion que cambia el valor de un paremetro del objeto
imageEdit.prototype.changeVal = function(valName, val) {

	this[valName] = val;
};

//log del objeto imageEdit _D
imageEdit.prototype.consoleMe = function() {

	console.log(this);
};

//obetener la posicion del cursor _D
imageEdit.prototype.getMousePos = function(canvas, evt) {
	var rect = this.canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
};

//escribir en canvas _D
imageEdit.prototype.writeMessage = function(position, message) {
	var c_message = message || "Vacio"
	var msgpos = position || {
		x: 0,
		y: 0
	};
	this.context.font = this.currentFontsize + 'pt ' + this.currentFont;
	console.log(this.currentColor);

	this.context.fillStyle = this.currentColor;
	//this.context.fillStyle = "#BABABA";
	this.context.fillText(c_message, msgpos.x, msgpos.y);
};

//Guarda un picel en el arreglo de pixeles _D
imageEdit.prototype.savePixels = function(currentPixel) {
	//console.log(currentPixel);
	this.pixelsAct.push([currentPixel.x, currentPixel.y]);
};

//Limpia el arreglo de pixeles _D
imageEdit.prototype.resetPixels = function() {
	//console.log(this.pixelsAct);
	this.pixelsAct = [];
};

//CTRL+Z undo
imageEdit.prototype.undoReact = function() {
	//si ya se deshizo una vez se rehace
	if (this.undoList[$(this.canvas).attr("id")] == "redo") {
		this.redoReact();
	} else {
		//antes de deshacer se guarda ek estado oara el rehacer
		this.redoList[$(this.canvas).attr("id")] = this.canvas.toDataURL();
		var img = new Image();
		var that = this;
		img.onload = function() {
			that.context.clearRect(0, 0, that.w, that.h); // fill in the pixel at (10,10)
			that.context.drawImage(img, 0, 0);
		};
		img.src = this.undoList[$(this.canvas).attr("id")];
		image = null;
		//se indica que no se puede deshacer mas
		this.undoList[$(this.canvas).attr("id")] = "redo";
	}
};

//CTRL+Z redo
imageEdit.prototype.redoReact = function() {
	//antes de rehacer se guarda el deshacer
	this.undoList[$(this.canvas).attr("id")] = this.canvas.toDataURL();
	var img = new Image();
	var that = this;
	img.onload = function() {
		that.context.clearRect(0, 0, that.w, that.h); // fill in the pixel at (10,10)
		that.context.drawImage(img, 0, 0);
	};
	img.src = this.redoList[$(this.canvas).attr("id")];
	image = null;
};

//realiza accion segun herramienta _D
imageEdit.prototype.doReact = function(pixelCoord, preview) {
	this.context.fillStyle = this.currentColor; //cambia el color de relleno para las herramientas
	this.context.strokeStyle = this.currentStroke_Color; //cambia el color de linea para los elementos
	switch (this.currentTool) {
		case "draw":
			this.draw(pixelCoord);
			break;
		case "eraser":
			this.erase(pixelCoord);
			break;
			//La figura puede recibir un punto a dos
		case "rectangle":
		case "line":
		case "circle":
			this.figure(pixelCoord);
			break;
		case "path":
			//el path recibe una lista de coordenadas
			this.figure(pixelCoord);
			break;
		case "text":
			this.writeMessage(pixelCoord, this.currentMessage);
			break;
		case "select":
			this.savePixels(pixelCoord);
			break;
		case "move":
			this.move(pixelCoord, this.previewAct);
			break;
		case "rotate":
			this.rotate(pixelCoord, this.previewAct);
			//this.rotate(pixelCoord, true);
			break;
		case "scale":
			this.scale(pixelCoord, this.previewAct);
			break;
		case "crop":
			this.crop(pixelCoord);
			break;
		default:
			console.log("%c No tool", 'background: #FFF; color: #A00');
			/*case "":
			 break;*/
	}
	//se reinicia la selección de pixeles despues de realizar una acción
	this.resetPixels();
	moodleReact(this.currentTool);
};

//Crea un gradiente _D
imageEdit.prototype.setGradient = function() {
	var gradient = this.context.createLinearGradient(0, 0, 0, 170);
	gradient.addColorStop(0, "black");
	gradient.addColorStop(1, "white");

	return gradient;
};

//dibuja un pixel o grupo de pixeles _D
imageEdit.prototype.draw = function(pixelCoord) {
	customLog("Draw", '#0A0');
	this.context.fillRect(pixelCoord.x, pixelCoord.y, this.currentFigSize, this.currentFigSize); // fill in the pixel at (10,10)
};

//move, rotate y scale toman un valor extra para dibujar sobre el preview
//funcion para mover el contenido de un canvas _D
imageEdit.prototype.move = function(pixelCoord, preview) {
	customLog("Move", '#0A0');
	//this.initClick -> mousedown saved pixel
	//pixelCoord -> mouse position
	this.context.save();
	this.baseContext.clearRect(0, 0, this.w, this.h);
	this.baseContext.drawImage(this.canvas, 0, 0);
	this.context.clearRect(0, 0, this.w, this.h); // fill in the pixel at (10,10)
	this.context.translate(pixelCoord.x - this.initClick.x, pixelCoord.y - this.initClick
		.y);
	this.context.drawImage(this.baseCanvas, 0, 0);
	this.context.restore();

	this.initClick = pixelCoord;
};

//funcion para rotar el contenido de un canvas _D
imageEdit.prototype.rotate = function(pixelCoord, preview) {
	customLog("Rotate", '#0A0');
	//this.initClick -> mousedown saved pixel
	//pixelCoord -> mouse position


	if (preview) {
		if (!$("#" + this.boss + ' .preview_canvas').hasClass("copied")) {
			this.previewContext.restore();
			this.previewContext.clearRect(0, 0, this.w, this.h);
			this.previewContext.drawImage(this.canvas, 0, 0);
			$("#" + this.boss + ' .preview_canvas').addClass("copied")
		};

		this.previewContext.save();
		this.baseContext.clearRect(0, 0, this.w, this.h);
		this.baseContext.drawImage(this.previewCanvas, 0, 0);
		this.previewContext.clearRect(0, 0, this.w, this.h); // fill in the pixel at (10,10)
		this.previewContext.translate(this.w / 2, this.h / 2);
		//this.previewContext.translate(this.initClick.x, this.initClick.y);

		if (pixelCoord.x > this.initClick.x) {
			//customLog("positivo", "#9B1BFD");
			this.previewContext.rotate(degree2rad(this.properties.degrees[0]));
			this.properties.degrees[1] += this.properties.degrees[0];
		} else {
			//customLog("negativo", "#E61616");
			this.previewContext.rotate(degree2rad(-this.properties.degrees[0]));
			this.properties.degrees[1] -= this.properties.degrees[0];
		};



		//this.previewContext.drawImage(this.baseCanvas, -this.initClick.x, -this.initClick.y);
		this.previewContext.drawImage(this.baseCanvas, -this.w / 2, -this.h / 2);
		this.previewContext.restore();

		$("#" + this.boss + ' .preview_canvas').removeClass("invisible");
	} else {
		this.context.save();

		customLog("No preview", "#5a0");
		this.baseContext.clearRect(0, 0, this.w, this.h);
		this.baseContext.drawImage(this.canvas, 0, 0);
		/*
			this.context.clearRect(0,0,this.w,this.h); // fill in the pixel at (10,10)
			this.context.translate(this.initClick.x, this.initClick.y);
			this.context.rotate(Math.PI / 4);
			this.context.drawImage(this.baseCanvas, -this.initClick.x, -this.initClick.y);
		*/
		this.context.clearRect(0, 0, this.w, this.h); // fill in the pixel at (10,10)
		this.context.translate(this.w / 2, this.h / 2);
		this.context.rotate(degree2rad(this.properties.degrees[1]));
		this.context.drawImage(this.baseCanvas, -this.w / 2, -this.h / 2);

		$("#" + this.boss + ' .preview_canvas').addClass("invisible");
		$("#" + this.boss + ' .copied').removeClass("copied");

		this.properties.degrees[1] = 0;

		this.context.restore();
	}

	this.initClick = pixelCoord;
};

//funcion para cortar una seccion de el canvas seleccionado
imageEdit.prototype.crop = function(pixelCoord) {
	//console.log(this.currentTool_act)
	console.log(pixelCoord);
	customLog("Crop", '#0A0');
	if (pixelCoord.length > 1) {
		//se limpia el base
		this.baseContext.clearRect(0, 0, this.w, this.h);
		this.baseContext.save();
		this.context.save();
		//se crea la seccion de corte
		this.baseContext.rect(pixelCoord[0][0], pixelCoord[0][1], (pixelCoord[1][0] -
			pixelCoord[0][0]), (pixelCoord[1][1] - pixelCoord[0][1]));
		this.context.stroke();
		this.baseContext.clip(); //se corta la sección
		this.baseContext.drawImage(this.canvas, 0, 0);
		//se dibuja solo la seccion
		//se limpia la seccion que se recorto
		this.context.clearRect(pixelCoord[0][0], pixelCoord[0][1], (pixelCoord[1][0] -
			pixelCoord[0][0]), (pixelCoord[1][1] - pixelCoord[0][1]));
		this.createCanvas(this.w, this.h);
		this.context.drawImage(this.baseCanvas, 0, 0); //dibujar sobre el mismo layer
		this.context.restore();
		this.baseContext.restore();
		this.baseContext.clearRect(0, 0, this.w, this.h);
	} else {}
};

//funcion para escalar el contenido de un canvas _D
imageEdit.prototype.scale = function(pixelCoord, preview) {
	customLog("Scale", '#0A0');
	//this.canvas.context.imageSmoothingEnabled = false;
	//this.initClick -> mousedown saved pixel
	//pixelCoord -> mouse position
	//variables para las dimensiones nuevas de la imagen
	var width_new, height_new;

	console.warn(preview);

	if (preview) {
		if (!$("#" + this.boss + ' .preview_canvas').hasClass("copied")) {
			this.previewContext.restore();
			this.previewContext.clearRect(0, 0, this.w, this.h);
			this.previewContext.drawImage(this.canvas, 0, 0);
			$("#" + this.boss + ' .preview_canvas').addClass("copied")
		};

		this.previewContext.save();
		this.previewContext.mozImageSmoothingEnabled = false;
		this.previewContext.webkitImageSmoothingEnabled = false;
		this.previewContext.msImageSmoothingEnabled = false;
		this.previewContext.imageSmoothingEnabled = false;
		this.baseContext.clearRect(0, 0, this.w, this.h);
		this.baseContext.drawImage(this.previewCanvas, 0, 0);

		this.previewContext.clearRect(0, 0, this.w, this.h); // fill in the pixel at (10,10)

		if (pixelCoord.x > this.initClick.x) {
			//customLog("positivo", "#9B1BFD");
			width_new = this.w * (this.properties.scaleFactor[0] + 1);
			height_new = this.h * (this.properties.scaleFactor[0] + 1);

			this.previewContext.translate((this.w - width_new) / 2, (this.h -
				height_new) / 2);
			this.previewContext.scale(1 + this.properties.scaleFactor[0], 1 + this.properties
				.scaleFactor[0]);
			this.properties.scaleFactor[1] += this.properties.scaleFactor[0]
		} else {
			//customLog("negativo", "#E61616");
			//si la disminución pasa a numeros negativos se invierte la imagen
			width_new = this.w * (-this.properties.scaleFactor[0] + 1);
			height_new = this.h * (-this.properties.scaleFactor[0] + 1);

			this.previewContext.translate((this.w - width_new) / 2, (this.h -
				height_new) / 2);
			this.previewContext.scale(1 - this.properties.scaleFactor[0], 1 - this.properties
				.scaleFactor[0]);
			this.properties.scaleFactor[1] -= this.properties.scaleFactor[0]
		}
		this.previewContext.drawImage(this.baseCanvas, 0, 0);
		this.previewContext.restore();
		$("#" + this.boss + ' .preview_canvas').removeClass("invisible");
	} else {
		customLog("No preview", "#5a0");
		width_new = this.w * (this.properties.scaleFactor[0] + this.properties.scaleFactor[
			1]);
		height_new = this.h * (this.properties.scaleFactor[0] + this.properties.scaleFactor[
			1]);

		this.context.save();

		this.baseContext.clearRect(0, 0, this.w, this.h);
		this.baseContext.drawImage(this.canvas, 0, 0);

		this.context.clearRect(0, 0, this.w, this.h); // fill in the pixel at (10,10)
		this.context.translate((this.w - width_new) / 2, (this.h - height_new) / 2);
		this.context.scale(this.properties.scaleFactor[0] + this.properties.scaleFactor[
			1], this.properties.scaleFactor[0] + this.properties.scaleFactor[1]);
		this.context.drawImage(this.baseCanvas, 0, 0);
		this.context.restore();

		$("#" + this.boss + ' .preview_canvas').addClass("invisible");
		$("#" + this.boss + ' .copied').removeClass("copied");
		this.properties.scaleFactor[1] = 1;
	}
	this.initClick = pixelCoord;
};


//funcion que crea un canvas con todas las capas
imageEdit.prototype.fusionLayers = function() {
	//se limpia el lienzo base
	this.baseContext.clearRect(0, 0, this.w, this.h);
	//se recorren las capas
	for (var i = 0; i < this.layers.length; i++) {
		console.log($('[data-canvas="' + this.layers[i] + '"] p').attr(
			'data-visible'));
		//se evalua si la capa actual esta visible
		if ($('[data-canvas="' + this.layers[i] + '"] p').attr('data-visible') ==
			"true") {
			this.canvas = document.getElementById(this.layers[i]);
			this.context = this.canvas.getContext('2d');
			//se van dibujando las capas sobre el lienzo base
			this.baseContext.drawImage(this.canvas, 0, 0);
		} else {
			//si no es visible se ignora
			console.warn("ignorado " + this.layers[i]);
		}
	};
	//se crea una capa nueva
	console.warn(
		"separar a funcion para que fusionCanvas solo regrese un lienzo y sea opcional el agregarlo a los layers o solo quedarse con ese"
	);

	var layer_FCanvas = document.createElement('canvas');
	$(layer_FCanvas).addClass("tmp_canvas invisible");
	layer_FCanvas.width = this.w;
	layer_FCanvas.height = this.h;

	var layer_FContext = layer_FCanvas.getContext('2d');
	layer_FContext.drawImage(this.baseCanvas, 0, 0);

	//se limpia el luienzo base
	this.baseContext.clearRect(0, 0, this.w, this.h);

	console.log(layer_FContext);
	console.log(layer_FCanvas);

	return layer_FCanvas;
};

//funcion para escalar el contenido de un canvas _D
imageEdit.prototype.scale = function(pixelCoord, preview) {
	customLog("Scale", '#0A0');
	//this.initClick -> mousedown saved pixel
	//pixelCoord -> mouse position
	//variables para las dimensiones nuevas de la imagen
	var width_new, height_new;

	console.warn(preview);

	if (preview) {
		if (!$("#" + this.boss + ' .preview_canvas').hasClass("copied")) {
			this.previewContext.restore();
			this.previewContext.clearRect(0, 0, this.w, this.h);
			this.previewContext.drawImage(this.canvas, 0, 0);
			$("#" + this.boss + ' .preview_canvas').addClass("copied")
		};

		this.previewContext.save();
		//this.previewContext.imageSmoothingEnabled = false;
		this.baseContext.clearRect(0, 0, this.w, this.h);
		this.baseContext.drawImage(this.previewCanvas, 0, 0);

		this.previewContext.clearRect(0, 0, this.w, this.h); // fill in the pixel at (10,10)

		if (pixelCoord.x > this.initClick.x) {
			//customLog("positivo", "#9B1BFD");
			width_new = this.w * (this.properties.scaleFactor[0] + 1);
			height_new = this.h * (this.properties.scaleFactor[0] + 1);

			this.previewContext.translate((this.w - width_new) / 2, (this.h -
				height_new) / 2);
			this.previewContext.scale(1 + this.properties.scaleFactor[0], 1 + this.properties
				.scaleFactor[0]);
			this.properties.scaleFactor[1] += this.properties.scaleFactor[0]
		} else {
			//customLog("negativo", "#E61616");
			//si la disminución pasa a numeros negativos se invierte la imagen
			width_new = this.w * (-this.properties.scaleFactor[0] + 1);
			height_new = this.h * (-this.properties.scaleFactor[0] + 1);

			this.previewContext.translate((this.w - width_new) / 2, (this.h -
				height_new) / 2);
			this.previewContext.scale(1 - this.properties.scaleFactor[0], 1 - this.properties
				.scaleFactor[0]);
			this.properties.scaleFactor[1] -= this.properties.scaleFactor[0]
		}
		this.previewContext.drawImage(this.baseCanvas, 0, 0);
		this.previewContext.restore();
		$("#" + this.boss + ' .preview_canvas').removeClass("invisible");
	} else {
		customLog("No preview", "#5a0");
		width_new = this.w * (this.properties.scaleFactor[0] + this.properties.scaleFactor[
			1]);
		height_new = this.h * (this.properties.scaleFactor[0] + this.properties.scaleFactor[
			1]);

		this.context.save();

		this.baseContext.clearRect(0, 0, this.w, this.h);
		this.baseContext.drawImage(this.canvas, 0, 0);

		this.context.clearRect(0, 0, this.w, this.h); // fill in the pixel at (10,10)
		this.context.translate((this.w - width_new) / 2, (this.h - height_new) / 2);
		this.context.scale(this.properties.scaleFactor[0] + this.properties.scaleFactor[
			1], this.properties.scaleFactor[0] + this.properties.scaleFactor[1]);
		this.context.drawImage(this.baseCanvas, 0, 0);
		this.context.restore();

		$("#" + this.boss + ' .preview_canvas').addClass("invisible");
		$("#" + this.boss + ' .copied').removeClass("copied");

		this.properties.scaleFactor[1] = 1;
	}

	this.initClick = pixelCoord;
};

//borra un pixel o un grupo de pixeles _D
imageEdit.prototype.erase = function(pixelCoord) {
	console.log("%c Erase", 'background: #FFF; color: #0A0');
	//this.context.fillStyle="#FFFFFF";
	this.context.clearRect(pixelCoord.x, pixelCoord.y, this.currentEraserSize,
		this.currentEraserSize); // fill in the pixel at (10,10)
};

//crea un path _D
imageEdit.prototype.path = function(pixelList) {
	this.context.beginPath();

	this.context.moveTo(pixelList[0].x, pixelList[0].y);

	for (var i = 1; i < pixelList.length; i++) {
		this.context.lineTo(pixelList[i].x, pixelList[i].y);
	};

	this.context.closePath();
	this.context.stroke();
	//this.context.fillStyle=this.currentBKGColor;
	this.context.fill();
};

//Dibuja figuras simples en el canvas _D
imageEdit.prototype.figure = function(pixelCoord) {
	this.currentFigure = this.currentTool;

	//console.log(this.currentFigure);
	//console.log(pixelCoord);
	switch (this.currentFigure) {
		case "line":
			if (pixelCoord.length > 1) {
				//console.log(pixelCoord);

				this.context.beginPath();
				this.context.moveTo(pixelCoord[0][0], pixelCoord[0][1]);
				this.context.lineTo(pixelCoord[1][0], pixelCoord[1][1]);
				this.context.lineWidth = this.currentStrokeSize;
				this.context.stroke();
			} else {

			}
			break;
		case "rectangle":
			//console.log(this.currentStrokeSize);
			this.context.fillRect((pixelCoord.x - (this.currentFigSize / 2)), (
				pixelCoord.y - (this.currentFigSize / 2)), this.currentFigSize, this.currentFigSize);
			this.context.lineWidth = this.currentStrokeSize;
			this.context.strokeRect((pixelCoord.x - (this.currentFigSize / 2)), (
				pixelCoord.y - (this.currentFigSize / 2)), this.currentFigSize, this.currentFigSize);
			break;

		case "circle":
			this.context.beginPath();
			//arc(x,y,radio,sAngle,eAngle,clockwise)
			this.context.arc(pixelCoord.x, pixelCoord.y, this.currentFigSize, 0, 2 *
				Math.PI, true);
			this.context.stroke();
			this.context.fill();
			break;
		default:
			console.log("No hay figura definida")
	}

	this.resetPixels();
};

//Carga una imagen en el canvas _D
/*
	image: imagen que se subio
	parent: parent es el this, para no perder la referencia en caso de que existan mas editores de imagen
	dataURL: si solo es un dataURL se crea el elemento en el banco de imágenes
*/
imageEdit.prototype.loadImage = function(image, parent, dataURL) {
	ndataURL = dataURL || null;

	src = image || "";
	// carga una imagen por medio de un dataURL
	var that = parent;
	base_image = new Image;
	base_image.src = src;
	base_image.setAttribute('crossOrigin', 'anonymous');

	//console.log($(base_image));
	base_image.onload = function() {
		console.warn("*********");
		console.log(that);
		//this.naturalWidth y this.naturalHeight hacen referencia a el tamaño real de la imagen que se esta cargando
		//console.log(this.width + " x " + this.height);
		//console.log(that.w + " x " + that.h);
		var aspect = 1;
		if (this.width > that.w || this.height > that.h) {
			//console.warn("necesita cambio");
			if (that.w <= that.h) { //el canvas es mas largo que alto
				aspect = that.w / this.width;
			} else {
				aspect = that.h / this.height;
			}
		};
		//console.log(aspect);
		this.width *= aspect;
		this.height *= aspect;

		//console.log(this);

		console.warn("evento en " + that.boss);

		that.createCanvas(that.w, that.h);
		that.context.drawImage(this, that.w / 2 - this.width / 2, that.h / 2 - this
			.height / 2, this.width, this.height); //dibujar sobre el mismo layer

		localStorage.setItem("savedImageData", that.canvas.toDataURL("image/png"));
	}

	// make sure the load event fires for cached images too
	if (base_image.complete || base_image.complete === undefined) {
		base_image.src =
			"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
		base_image.src = src;
	}

	//Si fue una imagen cargada le cambia el src al elemento que se creo antes
	if (ndataURL !== null) {
		//se hace referencia al elemento img del ultimo creado dentro de buscar imágenes
		$("#" + that.idP + "_buscarImg .imgElement .n_l_image:last-child").find(
			"img").attr("src", base_image.src);
	};

	/*para mooodle*/
	var format2Moodle = $(base_image)[0].attributes[0].nodeValue.split(";")[0].replace(
		"data:image/", "");
	moodleReact("loadImg", {
		"src": base_image.src,
		"format": format2Moodle
	});
	/**/
};

/*Solo para Moodle*/
imageEdit.prototype.saveImage = function(datos) {
	//alert("simulado de guardar");
	//console.log(datos);
	$("#" + this.boss + " .guardarImg").removeClass("hide");
};

// No terminada
//Para saber si un click ocurrio dentro de algo
var isInside = function(position, rect) {
	/*
		var mousePos = getMousePos(canvas, evt);
	    debugger;
		if (isInside(mousePos,rect)) {
			alert('clicked inside rect');
	    }else{
	        alert('clicked outside rect');
	    }
	*/

	return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect
		.heigth && pos.y > rect.y;
};
