 // This is called with the results from from FB.getLoginStatus().
var avatar,
    sesion_res;
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    status = response.status;
     if (response.status === 'connected') {
      testAPI();
    } else if (response.status === 'not_authorized') {
     } else {
     }
  }
 function checkLoginState(){
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);

    });
  }
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1504301486491959',
      cookie     : true,  // enable cookies to allow the server to access 
                          // the session
      xfbml      : true,  // parse social plugins on this page
      version    : 'v2.1' // use version 2.1
    });
  
  };

  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  function testAPI() {
    //console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log(response);
     // $(".login").html("Hola "+response.name );
    sesion_res =response;
    pictureAPI()     
    });
  }
   function pictureAPI() {
    FB.api('/me/picture?redirect=false', function(response) {
      console.log(response.data.url);
      sesion(sesion_res,response.data.url) 
    });
  }
   
function sesion (response,URL){
  console.log(response.id)
  id_usuario = response.name;
  var formData = new FormData();
  formData.append('userName',response.id);
  formData.append('userName',response.name);
  formData.append('userName',response.last_name);
  formData.append('userName',response.first_name);
  formData.append('userName',URL);
  var xhr = new XMLHttpRequest();
  xhr.open('post', '/', true);
  xhr.upload.onprogress = function(e) {
    if (e.lengthComputable) {
     var percentage = (e.loaded / e.total) * 100;
    }
  };
  xhr.onerror = function(e) {
  // alert('An error occurred while submitting the form. Maybe your file is too big');
  };
  xhr.onload = function() {
    $(".user").removeClass("active").html("<img src='"+URL+"' />"+"<span class='name'>"+response.name+"</span>" );
    $(".add").addClass("active");
   };
  xhr.send(formData);
}