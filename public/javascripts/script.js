var archivos=[];
var id_usuario
$('.alert').on('click', function(evt) {
    $('.alert').addClass('ocultar')
    if ($(this).hasClass('ok')) {
        $('.inputs').removeClass('ocultar');
        $('.progress').removeClass("visible");
        document.getElementById('myFile').value ="";
        document.getElementById('myName').value="";
        $('.alert')
        .removeClass()
        .addClass("btn-pic mensajes ocultar");
    }
});

$('.select_files.upload').on('click', function(evt) {
    alert("entro")
    var formData = new FormData();
    var file_ = document.getElementById('myFile');
    var name_ = document.getElementById('myName').value;
    var files_ = file_.files;
    var fl=files_.length;
    if(fl!=0 && name_!= ""){    
        var i=0;
        while ( i < fl) {
            archivos = files_[i];
            i++;
        formData.append('myFile', archivos);
        }
    formData.append('myName', name_);
    var xhr = new XMLHttpRequest();
    xhr.open('post', '/', true);
    xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
            var percentage = (e.loaded / e.total) * 100;
            $('.progress div.bar').css('width', percentage + '%');
        }
    };

    xhr.onerror = function(e) {
        $('.alert').html('An error occurred while submitting the form. Maybe your file is too big');
        // alert('An error occurred while submitting the form. Maybe your file is too big');
    };

    xhr.onload = function() {
        $('.alert').html("Gracias por comartir tus fotos");
    };
    
    xhr.send(formData);
    }else{

    $('.alert').removeClass("ocultar");
        if(name_== ""){ 
            $('.alert').addClass("miss")
            document.getElementById('myName').focus();
            $('.alert').html("Escribe tu nombre por favor");
        }else{ 
            $('.alert').addClass("miss")
            $('.alert').html("Agrega una imagen por favor");
        }
    }
});
var socket = io();
socket.on('message',function(msg){
    $('#messages').append(
        $('<div>').html(
            '<a href="/fotos-boda/'+msg.upFoto+'"><img src="/thumbnail/'+msg.upFoto+'"></a>'
        )
    );
});





