//calcula el vector entre dos puntos
function Vector(p1, p2){	
		this.x = p2.x - p1.x || 0,
		this.y = p2.y - p1.x || 0,
		this.z = p2.z - p1.z || 0;
	//console.log(this);
};


//suma dos vectores
sumaV = function (a,b){
	return {
		x:a.x + b.x,
		y:a.y + b.y,
		z:a.y + b.z
	};
};

//resta dos vectores
restaV = function (a,b){
	return {
		x:a.x - b.x,
		y:a.y - b.y,
		z:a.y - b.z
	};	
};

//multiplica un vector por una constante
multiplicaV = function (c,a){
	return {
		x:c * b.x,
		y:c * b.y,
		z:c * b.z
	};		
};

//divide un vector entre una constante
divideV = function (c,a){
	return {
		x:b.x/c,
		y:b.y/c,
		z:b.z/c
	};		
};

//calcula el producto escalar (punto) de dos vector 
var escalar = function (a,b){
	//a y b son vectores
	//A°B = Ax*Bx + Ay*By + Az*Bz
	var pp;
	pp = a.x*b.x + a.y*b.y + a.z*b.z;	
	return pp;
};

//regresa los valores normalizados de un vector
var normaliza = function(a){
	var magnitud = magnitud(a);

	return {
		x:a.x/magnitud,
		y:a.y/magnitud,
		z:a.z/magnitud
	};
};

//regresa el producto cruz de dos vectores
var cruz = function(a,b){
	return {
		x:((a.y*b.z) - (a.z*b.y)),
		y:((a.z*b.x) - (a.x*b.z)),
		z:((a.x*b.y) - (a.y*b.x))
	};
};

//calcula el modulo(maginitud) de un vector
var magnitud = function (a){
	//|A| = sqrt(Ax*Ax + Ay*Ay + Az*Az);
	var pp;
	pp = Math.sqrt((a.x*a.x) + (a.y*a.y) + (a.z*a.z));
	return pp;
};

//regresa el valor absoluto de un número
var absoluto = function(c){
	return c<0 ?  0-c : c;
}

//calcula el angulo entre dos vectores
var angle = function (a,b){
	var angle = Math.acos(escalar(a,b) / ( magnitud(a) * magnitud(b) ));
	return angle;
};

//regresa radianes
var degree2rad = function(degrees){
	return degrees*Math.PI/180;
};

//regresa grados
var rad2degree = function(radians){
	return radians*(180/Math.PI);
};