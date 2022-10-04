//for sign up content
$(document).ready(function () {
    $("#signup").click(function () {
        $("#signupcontent").slideToggle("slow");
        if( $('#signup').text() === "Sign up"){
            $('#signup').text(' Close ');
        }else{
            $('#signup').text('Sign up');
        }
       
    });
})