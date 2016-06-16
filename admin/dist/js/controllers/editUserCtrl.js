$(function() {
    document.onreadystatechange = function (e) {
        if (document.readyState === 'complete') {
            if (typeof Cookies.get('session-admin-cookie') == 'undefined'){
                $('body').mask('Loading...');
                window.location.href = "login.html";
            }
        }
    };

    var editBtn = $('#edit-btn');
    var saveBtn = $('#save-btn');
    var cancelBtn = $('#cancel-btn');

    $('#edit-user-error').hide();
    $('#edit-user-success').hide();
    saveBtn.hide();
    cancelBtn.hide();

    var userData = JSON.parse(sessionStorage.getItem('userData'));
    console.log(userData);
    $.each(userData, function(key,val){
        $('#edit-user-panel').find('.form-control[name="'+key+'"]').val(val);
    });

    editBtn.click(function(){
        $(this).hide();
        saveBtn.show();
        cancelBtn.show();
        $('#edit-user-panel').find('.form-control').prop('disabled', false);
    });

    saveBtn.click(function(){

        $.validator.addMethod(
            "regex",
            function(value, element, regexp) {
                if (regexp.constructor != RegExp)
                    regexp = new RegExp(regexp);
                else if (regexp.global)
                    regexp.lastIndex = 0;
                return this.optional(element) || regexp.test(value);
            },
            "Contraseña poco segura"
        );

        var validator = $( "#edit-user-form" ).validate({
            invalidHandler: function(event, validator) {
                console.log("Create user invalid form");
            },
            submitHandler: function(form){
                console.log("Create user valid form");
                var userNewData = {};
                userNewData.id = userData.id;
                $('#edit-user-panel').find('.form-control').each(function(){
                    var attr = $(this).attr('name');
                    if (attr !== 'repeatPassword') {
                        if (attr === 'password') {
                            if ($(this).val().length > 0) userNewData[attr] = $(this).val();
                        } else {
                            userNewData[attr] = $(this).val();
                        }
                    }
                });
                console.log(userNewData);
                $('body').mask("Loading...");
                $.ajax({
                    url : getConstants("API_URL") + "/users/edit",
                    type: "PUT",
                    data : JSON.stringify(userNewData),
                    contentType: 'application/json',
                    success: function(data, textStatus, jqXHR)
                    {
                        console.log("Edit user success",data,textStatus, jqXHR);
                        sessionStorage.setItem('userData', JSON.stringify(data.body));
                        $('#edit-user-success-text').text('El usuario '+data.body.username+' ha sido modificado con éxito.');
                        $('#edit-user-success').show();
                        window.scrollTo(0,0);
                        saveBtn.hide();
                        cancelBtn.hide();
                        editBtn.show();
                        $('#edit-user-panel').find('.form-control').prop('disabled', true);
                        $('body').unmask();
                    },
                    error: function (jqXHR, textStatus, errorThrown)
                    {
                        console.log("Edit user error", jqXHR, errorThrown);
                        $('body').unmask();
                        $('#edit-user-error-text').text(jqXHR.responseText);
                        $('#edit-user-error').show();
                        setTimeout(function(){
                            if ($('#edit-user-error').is(":visible"))
                                $('#edit-user-error').hide();
                        }, 30000);
                    }
                });
            },
            rules: {
                username: "required",
                password: {
                    minlength: 6,
                    regex: /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d).*$/,
                },
                repeatPassword: {
                    minlength: 6,
                    equalTo: '#password',
                    regex: /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d).*$/,
                },
                name: "required",
                surnames: "required",
                email: {
                    required: true,
                    email: true
                },
                birthDate: {
                    date: true
                }
            },
            messages: {
                username: "Campo obligatorio",
                password: {
                    minlength: "M\u00EDnimo 6 caracteres"
                },
                repeatPassword: {
                    minlength: "M\u00EDnimo 6 caracteres",
                    equalTo: "Las contrase\u00F1as no conciden"
                },
                name: "Campo obligatorio",
                surnames: "Campo obligatorio",
                birthDate: {
                    date: "La fecha debe ser estar en el formato DD/MM/YYY"
                },
                email: {
                    required: "Campo obligatorio",
                    email: "El email debe estar en el formato name@domain.com"
                }
            },
            errorClass: "form-error"
        });
    });

    cancelBtn.click(function(){
        cancelBtn.hide();
        saveBtn.hide();
        editBtn.show();
        $('#edit-user-panel').find('.form-control').prop('disabled', true);
    });
});