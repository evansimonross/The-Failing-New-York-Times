$(document).ready(function(){
  $('.sidenav').sidenav();
  $('#userForm').on("submit", function(event){
    event.preventDefault();
    var data = {};
    data.name = $('#userForm input[name=name]').val().trim();
    data.password = $('#userForm input[name=password').val();
    data.passwordConfirm = $('#userForm input[name=passwordConfirm]').val() || null;
    $.ajax({
      url: "/api/users",
      method: "POST",
      data: data
    }).then(function(response){
      console.log(response);
      if(response.success===true){
        window.location.href = "/";
      }
    });
  });
  $('#logout').on("click", function(event){
    event.preventDefault();
    $.get("/logout").then(function(response){
      console.log(response);
      if(response.success===true){
        window.location.href = "/";
      }
    });
  });
});