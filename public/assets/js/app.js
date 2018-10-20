$(document).ready(function () {

  $('.sidenav').sidenav();

  $('#scrape').on("click", function(){
    $.ajax({
      url: "/api/scrape",
      method: "POST",
    }).then(function(response){
      window.location.href = "/";
    });
  });

  $('#userForm').on("submit", function (event) {
    event.preventDefault();
    var data = {};
    data.name = $('#userForm input[name=name]').val().trim();
    data.password = $('#userForm input[name=password').val();
    data.passwordConfirm = $('#userForm input[name=passwordConfirm]').val() || null;
    $.ajax({
      url: "/api/users",
      method: "POST",
      data: data,
      error: function(err){
        alert(err.responseText);
      }
    }).then(function (response) {
      if (response.success === true) {
        window.location.href = "/";
      }
      else{
        alert(response);
      }
    });
  });

  $('#commentForm').on("submit", function (event) {
    event.preventDefault();
    var data = {};
    data.text = $('#commentForm textarea').val().trim();
    data.article = $('#commentForm').data("id");
    $.ajax({
      url: "/api/comments",
      method: "POST",
      data: data
    }).then(function (response) {
      location.reload();
    });
  });

  $('.vote').on("click", function () {
    var data = {};
    data.text = $(this).hasClass("sad") ? "sad" : $(this).hasClass("fake") ? "fake" : "boring";
    data.article = $(this).data("id");
    var method = $(this).hasClass("highlighted") ? "DELETE" : "POST";
    $.ajax({
      url: "/api/votes",
      method: method,
      data: data
    }).then(function (response) {
      location.reload();
    });
  });

  $('#logout').on("click", function () {
    $.get("/logout").then(function (response) {
      console.log(response);
      if (response.success === true) {
        window.location.href = "/";
      }
    });
  });
});