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
        $.each(userData, function(key){
            var value = $('#edit-user-panel').find('.form-control[name="'+key+'"]').val();
            if (value) userData[key] = $('#edit-user-panel').find('.form-control[name="'+key+'"]').val();
        });
        console.log(userData);
        $('body').mask("Loading...");
        $.ajax({
            url : "http://localhost:8080/users/edit",
            type: "PUT",
            data : JSON.stringify(userData),
            contentType: 'application/json',
            success: function(data, textStatus, jqXHR)
            {
                console.log("Edit user success",data,textStatus, jqXHR);
                sessionStorage.setItem('userData', JSON.stringify(data.body));
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
    });

    cancelBtn.click(function(){
        cancelBtn.hide();
        saveBtn.hide();
        editBtn.show();
        $('#edit-user-panel').find('.form-control').prop('disabled', true);
    });
});