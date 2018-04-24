var initBuscador = function(){
	console.warn("se ejecuto el init del buscador");

	//para que solo las respuestas del simulador de busqueda esten alineadas con la imagen de navegador.
	try{
		$j('.ansRediz input').attr("size",40);	
	}catch(e){
		console.warn("no hay .ansRediz");
	}
	

	$j('.contenedor_buscador').on("mouseenter mouseover",function(e){
		answerId = $(this).attr("data-moodleId")
	});
	//Se inicializan los onclick en todos las ligas generadas 
	//por Google.
    $j(".buscador").on( "change mouseover ", function(){
    	$j("a").click(function()
		{
			var di = $j(this)[0].outerHTML;
			var a = di.split(" ");
			var aux = di.split(" ");
			$j.each(a, function(x,y){
				var posicion = x;
				if(y.substr(0,11) == "data-ctorig")
				{
					direc = aux[x];
				}											
			});
			direccion = direc;	
		    di ="";

		    var answ = direccion.replace('data-ctorig="',"");
		    answ = answ.substring(0, answ.indexOf('"'));
		    //console.log("actualiza respuesta " + answerId + " con " + answ);
			var input = document.getElementById(answerId);
		    $j(input).val(answ).text(answ);			    
		});	
   });

    $j(".frameCont")
    		.css("height", ($j(".contenedor_buscador").width()/2));
    	


   	$j(".gsc-results.gsc-webResult")
   		.css("max-height", "400px");
    	//.css("max-height", (($j(".contenedor_buscador").width()/2))-300);
}

var obtener = function(id){
	var aux=$j("#"+id+"").val();
	aux=aux.length;

	if(direccion==null && aux <= 0 )
	{
		alert("No has seleccionado nada");
	}
	else
	{
		if(direccion!=null)
		{
			$j("#"+id+"").attr("value",direccion);
			direccion=null;
		}
	}
	aux=$j("#"+id+"").val();
	aux = aux.substring(13,aux.length-1);
	
	alert("La pagina que enviaras sera "+aux+" ");
};

var cargaFrame = function(id){

};