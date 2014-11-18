var archivos=[];
var id_usuario
$('.mensajes').on('click', function(evt) {
    $('.mensajes').addClass('ocultar')
    if ($(this).hasClass('ok')) {
        $('.inputs').removeClass('ocultar');
        $('.progress').removeClass("visible");
        document.getElementById('myFile').value ="";
        document.getElementById('myName').value="";
        $('.mensajes')
        .removeClass()
        .addClass("btn-pic mensajes ocultar");
    }
});
$(".login").click(function(){
  check();
})

$('.upload').on('click', function(evt) {
    alert('entro')
    var formData = new FormData();
    var file_ = document.getElementById('myFile');
    var name_ = document.getElementById('myName').value;
    var files_ = file_.files;
    var fl=files_.length;

    if(fl!=0 && name_!= ""){    
        $('.inputs').addClass('ocultar')
        $('.mensajes')
        .removeClass()
        .addClass("btn-pic mensajes ocultar");
        $('.progress').addClass("visible");
        var i=0;
        while ( i < fl) {
            archivos = files_[i];
            i++;
        formData.append('myFile', archivos);
    }

    formData.append('myName', name_);
    formData.append('myName', name_);
    var xhr = new XMLHttpRequest();
    xhr.open('post', '/', true);
    xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
            var percentage = (e.loaded / e.total) * 100;
            $('div.progress div.bar').css('width', percentage + '%');
        }
    };

    xhr.onerror = function(e) {
        $('.mensajes').removeClass("ocultar");
        $('.mensajes').addClass("error")
        $('.mensajes').html('An error occurred while submitting the form. Maybe your file is too big');
        // alert('An error occurred while submitting the form. Maybe your file is too big');
    };

    xhr.onload = function() {
        $('.mensajes').removeClass("ocultar");
        $('div.bar').addClass('stop');
        $('.mensajes').addClass("ok")
        $('.mensajes').html("Gracias por comartir tus fotos");
    };
    
    xhr.send(formData);
    }else{

    $('.mensajes').removeClass("ocultar");
        if(name_== ""){ 
            $('.mensajes').addClass("miss")
            document.getElementById('myName').focus();
            $('.mensajes').html("Escribe tu nombre por favor");
        }else{ 
            $('.mensajes').addClass("miss")
            $('.mensajes').html("Agrega una imagen por favor");
        }
    }
});
var socket = io();
socket.on('message',function(msg){
//nombre,'upFoto':upFoto,'type':type
$('#messages').append(
$('<li>').html(
'<a href="/fotos-boda/'+msg.upFoto+'"><img src="/thumbnail/'+msg.upFoto+'"></a>'
)
);
});
var check = function(){
 if(typeof FB === 'undefined'){
   // your code here.
         setTimeout(function(){check();}, 1000);
    }else{
        checkLoginState();
    }
}





