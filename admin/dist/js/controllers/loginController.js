$(function() {

    $('#login-error').hide();

    document.onreadystatechange = function (e) {
        if (document.readyState === 'complete') {
            if (typeof Cookies.get('session-admin-cookie') != 'undefined') {
                $('body').mask('Loading...');
                window.location.href = "index.html";
            }
        }
    };

    $(".form-control").keyup(function(event){
        if(event.keyCode == 13){
            $(".btn-login").click();
        }
    });

    $('.btn-login').click(function(){
        console.log("Login");

        $('body').mask("Loading...");

        var formData = JSON.stringify({username: $('#login-username').val(),password: $('#login-pwd').val()});

        $.ajax({
            url : "http://localhost:8080/users/login",
            type: "POST",
            data : formData,
            contentType: 'application/json',
            success: function(data, textStatus, jqXHR)
            {
                console.log("Login success",data,textStatus, jqXHR);
                Cookies.set('session-admin-cookie', $.md5(data.username, data.id));
                window.location.href = "index.html";
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                console.log("Login error", jqXHR, errorThrown);
                $('body').unmask();
                $('#login-error-text').text(jqXHR.responseText);
                $('#login-error').show();
                setTimeout(function(){
                    if ($('#login-error').is(":visible"))
                        $('#login-error').hide();
                }, 30000);
            }
        });
    });
});