var resize_window = 0;
var IMG;
function fullsize(imagen){
            var h  = window.innerHeight;
            var w  = window.innerWidth;
            var fondo = document.getElementById("fondo")
            var contenedor = document.getElementById("contenedor")
            contenedor.innerHTML ="";
            var size = document.getElementById("_"+imagen);
            var img = document.createElement("img");
            img.src = size.src;
            img.style.height = h+"px";
            img.style.width = "auto";
            fondo.className =fondo.className+" full";
            document.body.style.overflow = "hidden";
            contenedor.appendChild(img);
          //  alert(w+":"+h+":"+img.clientWidth);
            if (img.clientWidth > w){
                img.style.height ="auto";
               img.style.width = "100%";
            }
            resize_window

}
        function imgresize(imagen){
            IMG = imagen;
            var w  = window.innerWidth;
            var h  = window.innerHeight;
            var size = document.getElementById("_"+imagen);
            size.style.height = (h*.5)+"px";
            size.style.width = "auto";
            if (size.clientWidth > w){
                size.style.height ="auto";
               size.style.width = "100%";
            }
            console.log(size)
        }
        function imagen_load(imagen){
           document.getElementById(imagen).className =document.getElementById(imagen).className+" active";
        }
function cerrarFondo(){
    document.body.style.overflow = "";
    fondo.classList.remove("full");
  
    resize_window =1

}
window.onresize = function(){
    if(resize_window==1){
       fullsize(IMG)
    }else{
       imgresize(IMG);
    }
}
