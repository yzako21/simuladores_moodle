//funcion para objetos equivalente para el lenght de arreglos
function size(obj){
	var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

//funcion para mensajes de consola con colores
function customLog(string, colorText , colorBkg){
	var msg = string || "",
		background = colorBkg || "#FFF",
		color = colorText || "#000"
	;

	console.log("%c "+msg+"", 'background: '+background+'; color: '+color+'');
	console.log();
};

//funcion que elimina un elemento de un arreglo
function r_arrayElement(element, array){
	//var array = ['A', 'B', 'C']; // Test
	//var element = 'B';

	for (var i=array.length-1; i>=0; i--) {
	    if (array[i] === element) {
	        array.splice(i, 1);
	        // break;       //<-- Uncomment  if only the first term has to be removed
	    }
	}
};


//revuelve un arreglo
function randomArray(array){
	var arrayNR = array.slice(0)
	,   arrayR = []   
	;

	for (var i = 0; i < array.length; i++) {
		var randomWord = randomVar.integer({min:0, max:arrayNR.length-1});
		arrayR.push(arrayNR[randomWord]);
		arrayNR.splice(randomWord, 1);
	};

	//console.warn("array sin random = "+ array);
	//console.warn("array con random = " + arrayR);

	return arrayR;

}



//obtiene el hexadecimal de un color en rgb
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

//obtiene los conponentes de un color en hexadecimal
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
//por componente
/*
	console.log( hexToRgb("#ffaa00").r ); //255
	console.log( hexToRgb("#ffaa00").g ); //170
	console.log( hexToRgb("#ffaa00").b ); //0
*/


//funcion para remover acentos
function RemoveAccents(str) {
  var accents    = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
  var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
  str = str.split('');
  var strLen = str.length;
  var i, x;
  for (i = 0; i < strLen; i++) {
    if ((x = accents.indexOf(str[i])) != -1) {
      str[i] = accentsOut[x];
    }
  }
  return str.join('');
}


/*
//solo remover el texto de un elemento sin tomar en cuenta el texto de sus hijos
$("#foo")
.clone()    //clone the element
.children() //select all the children
.remove()   //remove all the children
.end()  //again go back to selected element
.text();
*/


//funcion para colocar el cursor de texto hasta el final de un elemento
/*function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
    //para que no se repita el id dentro del pre
    $(el).removeAttr("id");
}*/