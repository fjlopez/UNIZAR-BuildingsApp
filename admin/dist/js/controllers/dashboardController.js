$(function() {
    document.onreadystatechange = function (e) {
        if (document.readyState === 'complete') {
            if (typeof Cookies.get('session-admin-cookie') == 'undefined'){
                $('body').mask('Loading...');
                window.location.href = "login.html";
            }
        }
    };

    $('#logout-link').click(function(e){
        e.preventDefault();
        $('body').mask('Loading...');
        Cookies.remove('session-admin-cookie');
        window.location.href = 'login.html';
    });
});