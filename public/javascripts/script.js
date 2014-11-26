var xhr ={}
,files_
,fl
,M
,formData ={}
,parentElement = document.getElementById('messages')
,socket = io();

$('.upload').on('click', function(evt) {
    var file_ = document.getElementById('myFile');
    files_ = file_.files;
    fl=files_.length;
    M = 0 ;
    if(fl!=0){
    $('.upload').removeClass("active");
        var i=0;
        while ( i < fl) {
            xhr[i] = new XMLHttpRequest();
            i++;
        }
    sendFIles(M);    
    }
});

$('.alert').on('click', function(evt) {
    $('.alert').removeClass("active");
    $('.add').addClass("active");
});
socket.on('message',function(msg){
       //alert( msg[i])
        var theFirstChild = parentElement.firstChild;
        var newElement = document.createElement("div");
            newElement.innerHTML ='<a href="/'+msg+'"><img src="/thumbnail/'+msg+'"></a>';
        parentElement.insertBefore(newElement, theFirstChild);
});

var change = function(n){
    var file_ = document.getElementById('myFile');
    console.log(file_.files.length);
    if (file_.files.length > 0){
        $('.add').removeClass("active");
        $('.upload').addClass("active");
    }
}

var sendFIles = function(n){
    if (M<fl){
        formData[n] = new FormData();
        formData[n].append('myFile', files_[n]);
        xhr[n].open('post', '/', true);
        xhr[n].upload.onprogress = function(e) {
            if (e.lengthComputable) {
                var percentage = (e.loaded / e.total) * 100;
                $('.progress').addClass("active");
                $('.progress .bar').removeClass("stop");
                $('.progress .bar').css('width', percentage + '%');
            }
        };
        xhr[n].onerror = function(e) {
            $('.alert').addClass("active").html('An error occurred while submitting the form. Maybe your file is too big');
        };
        xhr[n].onload = function() {
            $('.progress .bar').addClass("stop")
            socket.emit('message', id_usuario);
            if (M==fl-1){
                $('.alert').addClass("active").html("Gracias por comartir tus fotos  x");
                $('.progress').removeClass("active")
            }
            M++; 
            sendFIles(M); 
        };
        xhr[n].send(formData[n]);
    }
}
function doClick() {
      var el = document.getElementById("myFile");
      if (el) {
        el.click();
      }
    }
