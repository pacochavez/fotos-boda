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
    var formData = new FormData();
    var file_ = document.getElementById('myFile');
    // var name_ = document.getElementById('myName').value;
    // var name_ = document.getElementById('myId').value;
    var files_ = file_.files;
    var fl=files_.length;
    if(fl!=0){    
        var i=0;
        while ( i < fl) {
            archivos = files_[i];
            i++;
        formData.append('myFile', archivos);
        }
    // formData.append('myName', name_);
    var xhr = new XMLHttpRequest();
    xhr.open('post', '/', true);
    xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
            var percentage = (e.loaded / e.total) * 100;
            $('.progress').addClass("active");
            $('.progress div.bar').css('width', percentage + '%');
        }
    };

    xhr.onerror = function(e) {
        $('.alert').addClass("active").html('An error occurred while submitting the form. Maybe your file is too big');
        // alert('An error occurred while submitting the form. Maybe your file is too big');
    };

    xhr.onload = function() {
        $('.alert').addClass("active").html("Gracias por comartir tus fotos");
    };
    
    xhr.send(formData);
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





