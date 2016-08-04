$(function() {
    document.onreadystatechange = function (e) {
        if (document.readyState === 'complete') {
            if (typeof Cookies.get('session-admin-cookie') == 'undefined'){
                $('body').mask('Loading...');
                window.location.href = "login.html";
            }
        }
    };

    $('#admin-requests-error').hide();
    $('#admin-requests-success').hide();

    $(document).ready( function () {

        var fillModal = function(mode, requestData){

            var type = requestData.type === 'edit' ? 'modifación' : 'eliminación';

            if (requestData.type === 'edit') $('#form-request-reason').hide();

            if (mode === 'accept') {
                $('#request-modal-title').text('Aprobar '+ type +' - ID: ' + requestData.poi);
                var title = '¿Está seguro de aceptar la '+type+' del punto de interés?<br>';
                if (requestData.type==='edit') title += '<br>Los campos modificados por el usuario son \'Categoría\' y \'Comentarios\'';
                $('#request-modal-panel').html(title);
                $('#request-btn').text('Aprobar');
            }
            else {
                $('#request-modal-title').text('Rechazar '+ type +' - ID: ' + requestData.poi);
                var title = '¿Está seguro de rechazar la '+type+' del punto de interés?<br>';
                if (requestData.type==='edit') title += '<br>Los campos modificados por el usuario son \'Categoría\' y \'Comentarios\'';
                $('#request-modal-panel').html(title);
                $('#request-btn').text('Rechazar');
            }

            console.log("Request data", requestData);
            for (var key in requestData) {
                if (mode!='edit' || (key !== 'city' && key !== 'campus' && key !== 'category')) {
                    if ($('#request-'+key).length > 0)
                        $('#request-'+key).val(requestData[key]);
                }
            }

            var category = $.grep(getConstants('categories'), function(e){ return e.value === requestData.category;});
            $('#request-category').val(category[0].label);
        }

        //Define table configuration
        var requestsTable = $('#dataTable-requests').DataTable({
            ajax: {
                url: getConstants("API_URL") + "/pois/request/pending/",
                dataSrc: ''
            },
            language: getTranslation('editor'),
            dom: 'Bfrtip',
            responsive: true,
            scrollX: true,
            paging: true,
            select: {
                style: 'single'
            },
            sort: true,
            lengthMenu: [
                [10,25,50],
                ['10','25','50']
            ],
            buttons: [
                'pageLength',
                {
                    text: 'Refresh',
                    action: function ( e, dt, node, config ) {
                        $('#dataTable-requests').DataTable().ajax.reload();
                    }
                },
                {
                    text: 'Aprobar',
                    action: function ( e, dt, node, config ) {
                        if ($('#dataTable-requests').DataTable().rows({ selected: true })[0].length == 1) {
                            var requestData = $('#dataTable-requests').DataTable().rows({ selected: true }).data()[0];

                            fillModal('accept', requestData);

                            $('#request-modal').modal({
                                keyboard: true,
                                backdrop: "static",
                                show:true,
                            });
                        }
                    }
                },
                {
                    text: 'Rechazar',
                    action: function ( e, dt, node, config ) {
                        if ($('#dataTable-requests').DataTable().rows({ selected: true })[0].length == 1) {
                            var requestData = $('#dataTable-requests').DataTable().rows({ selected: true }).data()[0];

                            fillModal('reject', requestData);

                            $('#request-modal').modal({
                                keyboard: true,
                                backdrop: "static",
                                show:true,
                            });
                        }
                    }
                }
            ],
            columns: [
                { data: 'id', type: 'num' },
                { data: 'type', render: function(data, type, full, meta){
                    if (data === 'edit') return "Edición";
                    else if (data === 'delete') return "Eliminación";
                }},
                { data: 'status', render: function(data, type, full, meta){
                    if (data === 'pending') return "Pendiente";
                    else if (data === 'approved') return "Aprobada";
                    else if (data === 'rejected') return "Rechazada";
                }},
                { data: 'poi', type: 'num' },
                { data: 'category', defaultContent: '', render: function(data,type,full,meta){
                    var category = $.grep(getConstants('categories'), function(e){ return e.value === data;});
                    return category[0].label;
                }},
                { data: 'comment', defaultContent: ''},
                { data: 'reason', defaultContent: ''},
                { data: 'city' },
                { data: 'campus' },
                { data: 'building' },
                { data: 'room' },
                { data: 'floor', type: 'num' }
            ]
        });
    });

    //Define action on click 'Aceptar'/'Rechazar' button for modify/delete a POI
    $('#request-btn').click(function(){
        
        $('body').mask("Enviando...");

        var requestData = $('#dataTable-requests').DataTable().rows({ selected: true }).data()[0];

        var operation = $('#request-btn').text() === 'Aprobar' ? 'approve' : 'reject';

        $.ajax({
            url : getConstants("API_URL") + "/pois/request/"+requestData.id+"/"+operation+"/"+requestData.type+"/",
            type: 'PUT',
            contentType: 'application/json',
            success: function(data, textStatus, jqXHR)
            {
                console.log("Success request for "+requestData.type+" poi",data);
                $('#dataTable-requests').DataTable().ajax.reload();
                $('#request-modal .close').click();
                $('body').unmask();

                $('#admin-requests-success-text').text(data);
                $('#admin-requests-success').show();
                setTimeout(function(){
                    if ($('#admin-requests-success').is(":visible"))
                        $('#admin-requests-success').hide();
                }, 30000);
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                console.log("Error on request for "+requestData.type+" poi error", jqXHR, errorThrown);
                $('body').unmask();
                $('#request-modal .close').click()
                var typeMsg = requestData.type === 'edit' ? 'edición' : 'eliminación';
                var operationMsg = $('#request-btn').text() === 'Aprobar' ? 'aprobar' : 'rechazar';
                if ($('#admin-requests-error').is(":visible")) $('#admin-requests-error').hide();
                $('#admin-requests-error-text').text("Error al "+operationMsg+" la "+typeMsg+" del punto de interés: " + jqXHR.responseText);
                $('#admin-requests-error').show();
                setTimeout(function(){
                    if ($('#admin-requests-error').is(":visible"))
                        $('#admin-requests-error').hide();
                }, 30000);
            }
        });
    });
});