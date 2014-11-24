var archivos=[];

$('.alert').on('click', function(evt) {

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
            $('.progress .bar').css('width', percentage + '%');
        }
    };

    xhr.onerror = function(e) {
        $('.alert').addClass("active").html('An error occurred while submitting the form. Maybe your file is too big');
        // alert('An error occurred while submitting the form. Maybe your file is too big');
    };

    xhr.onload = function() {
        $('.alert').addClass("active").html("Gracias por comartir tus fotos");
        $('.user').html("Gracias por comartir tus fotos");
        $('.progress .bar').addClass("stop")
        socket.emit('message', id_usuario);
    };
    
    xhr.send(formData);
    }
});

var parentElement = document.getElementById('messages');
var socket = io();
socket.on('message',function(msg){
     for (var i in msg) {
       //alert( msg[i])
        var theFirstChild = parentElement.firstChild;
        var newElement = document.createElement("div");
            newElement.innerHTML ='<a href="/fotos-boda/'+msg[i]+'"><img src="/fotos-boda/'+msg[i]+'"></a>';
        parentElement.insertBefore(newElement, theFirstChild);
        document.getElementById('myFile').value ="";
    }
});
