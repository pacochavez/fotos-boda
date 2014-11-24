

$('.alert').on('click', function(evt) {

});
var xhr ={}
var files_;
var fl;
var M;
$('.select_files.upload').on('click', function(evt) {
    
    var file_ = document.getElementById('myFile');
    files_ = file_.files;
    fl=files_.length;
    M = 0 ;
    if(fl!=0){
        var i=0;
        while ( i < fl) {
            xhr[i] = new XMLHttpRequest();
            i++;
        }
    sendFIles(M);    
    }

});
var parentElement = document.getElementById('messages');
var socket = io();
socket.on('message',function(msg){
       //alert( msg[i])
        var theFirstChild = parentElement.firstChild;
        var newElement = document.createElement("div");
            newElement.innerHTML ='<a href="/fotos-boda/'+msg+'"><img src="/thumbnail/'+msg+'"></a>';
        parentElement.insertBefore(newElement, theFirstChild);
});

var formData ={}
var sendFIles = function(n){
    if (M<fl){
              formData[n] = new FormData();
            
            formData[n].append('myFile', files_[n]);
           
        // formData[n].append('myName', name_);
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
                // alert('An error occurred while submitting the form. Maybe your file is too big');
            };

            xhr[n].onload = function() {
                
                M++; 
                $('.alert').addClass("active").html("Gracias por comartir tus fotos");
                $('.user').html("Gracias por comartir tus fotos");
                $('.progress .bar').addClass("stop")
                socket.emit('message', id_usuario);
            
               sendFIles(M); 

               

            };
            
            xhr[n].send(formData[n]);
    }
            
           


}

