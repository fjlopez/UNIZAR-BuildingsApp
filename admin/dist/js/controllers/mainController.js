$(function() {
    document.onreadystatechange = function (e) {
        if (document.readyState === 'complete') {
            if (typeof Cookies.get('session-admin-cookie') == 'undefined') {
                window.location.href = "pages/login.html";
            }
            else {
                $('body').mask('Loading...');
                window.location.href = "pages/index.html";
            }
        }
    };
});