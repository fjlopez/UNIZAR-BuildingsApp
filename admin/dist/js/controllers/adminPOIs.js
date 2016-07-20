$(function() {
    document.onreadystatechange = function (e) {
        if (document.readyState === 'complete') {
            if (typeof Cookies.get('session-admin-cookie') == 'undefined'){
                $('body').mask('Loading...');
                window.location.href = "login.html";
            }
        }
    };

    $('#admin-pois-error').hide();
    $('#admin-pois-success').hide();

    $(document).ready( function () {

        var fillModal = function(mode, campusValues, poiData){

            $('#'+mode+'-poi-modal-title').text($('#'+mode+'-poi-modal-title').text() + ' - ID: ' + poiData.id);

            if (mode === 'edit') {
                var selCampus = $('#'+mode+'-poi-campus');
                selCampus.empty();
                campusValues.forEach(function(campus){
                    selCampus.append('<option value="' + campus + '">' + campus + '</option>');
                });
                var selCity = $('#'+mode+'-poi-city');
                selCity.empty();
                getConstants('cities').forEach(function(city){
                    selCity.append('<option value="' + city.value + '">' + city.label + '</option>');
                });
                var selCategory = $('#'+mode+'-poi-category');
                selCategory.empty();
                getConstants('categories').forEach(function(category){
                    selCategory.append('<option value="' + category.value + '">' + category.value + '</option>');
                });
            }

            for (var key in poiData) {
                if (mode!='edit' || (key !== 'city' && key !== 'campus' && key !== 'category')) {
                    if ($('#'+mode+'-poi-'+key).length > 0)
                        $('#'+mode+'-poi-'+key).val(poiData[key]);
                }
            }

            $('#'+mode+'-poi-approved').attr('checked', poiData.approved);
        }

        //Define table configuration
        var poisTable = $('#dataTable-pois').DataTable({
            ajax: {
                url: getConstants("API_URL") + "/pois/",
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
                    text: 'Editar',
                    action: function ( e, dt, node, config ) {
                        $('body').mask("Cargando...");
                        if ($('#dataTable-pois').DataTable().rows({ selected: true })[0].length == 1) {
                            var poiData = $('#dataTable-pois').DataTable().rows({ selected: true }).data()[0];
                            $.ajax({
                                url : getConstants("API_URL") + "/estancias/campus",
                                type: "GET",
                                contentType: 'application/json',
                                success: function(campusValues, textStatus, jqXHR)
                                {
                                    console.log("Get distinct campus",campusValues);

                                    fillModal('edit', campusValues, poiData);

                                    $('#edit-poi-modal').modal({
                                        keyboard: true,
                                        backdrop: "static",
                                        show:true,
                                    });

                                    $('body').unmask();
                                },
                                error: function (jqXHR, textStatus, errorThrown)
                                {
                                    console.log("Get distinct campus error", jqXHR, errorThrown);
                                    $('body').unmask();
                                    $('#admin-pois-error-text').text("Error recuperando los datos del punto de interés: " + jqXHR.responseText);
                                    $('#admin-pois-error').show();
                                    setTimeout(function(){
                                        if ($('#admin-pois-error').is(":visible"))
                                            $('#admin-pois-error').hide();
                                    }, 30000);
                                }
                            });
                        }
                    }
                },
                {
                    text: 'Eliminar',
                    action: function ( e, dt, node, config ) {
                        if ($('#dataTable-pois').DataTable().rows({ selected: true })[0].length == 1) {
                            var poiData = $('#dataTable-pois').DataTable().rows({ selected: true }).data()[0];

                            fillModal('delete',null, poiData);

                            $('#delete-poi-modal').modal({
                                keyboard: true,
                                backdrop: "static",
                                show:true,
                            });
                        }
                    }
                }
            ],
            columns: [
                { data: 'id' },
                { data: 'approved', render: function(data, type, full, meta){
                    return data === true ? 'Sí' : 'No';
                }},
                { data: 'category' },
                { data: 'city' },
                { data: 'campus' },
                { data: 'building' },
                { data: 'roomId' },
                { data: 'roomName' },
                { data: 'address' },
                { data: 'floor', type: 'num' },
                { data: 'comments' },
                { data: 'latitude', searchable: false },
                { data: 'longitude', searchable: false }
            ]
        });
    });

    //Define action on click Save button for modify a POI
    $('#edit-poi-btn').click(function(){
        $('body').mask("Enviando...");

        var poiData = $('#dataTable-pois').DataTable().rows({ selected: true }).data()[0],
            sendData = {};

        for (var key in poiData) {
            if ($('#edit-poi-'+key).length > 0)
                sendData[key] = $('#edit-poi-'+key).val();
            else
                sendData[key] = poiData[key];
        }

        sendData['approved'] = $('#edit-poi-approved').is(":checked");

        $.ajax({
            url : getConstants("API_URL") + "/pois/",
            type: "PUT",
            data : JSON.stringify(sendData),
            contentType: 'application/json',
            success: function(data, textStatus, jqXHR)
            {
                console.log("Modify poi", data);
                $('#dataTable-pois').DataTable().ajax.reload();
                $('#edit-poi-modal .close').click();
                $('body').unmask();
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                console.log("Modify poi error", jqXHR, errorThrown);
                $('body').unmask();
                $('#edit-poi-modal .close').click();
                $('#admin-pois-error-text').text("Error editando el punto de interés: " + jqXHR.responseText);
                $('#admin-pois-error').show();
                setTimeout(function(){
                    if ($('#admin-pois-error').is(":visible"))
                        $('#admin-pois-error').hide();
                }, 30000);
            }
        });
    });

    //Define action on click 'Eliminar' button for delete a POI
    $('#delete-poi-btn').click(function(){
        $('body').mask("Enviando...");

        var poiData = $('#dataTable-pois').DataTable().rows({ selected: true }).data()[0];

        $.ajax({
            url : getConstants("API_URL") + "/pois/"+poiData.id+"/",
            type: "DELETE",
            contentType: 'application/json',
            success: function(data, textStatus, jqXHR)
            {
                console.log("Delete poi",data,textStatus, jqXHR);
                $('#dataTable-pois').DataTable().ajax.reload();
                $('#delete-poi-modal .close').click();
                $('body').unmask();
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                console.log("Delete poi error", jqXHR, errorThrown);
                $('body').unmask();
                $('#delete-poi-modal .close').click()
                $('#admin-pois-error-text').text("Error editando el punto de interés: " + jqXHR.responseText);
                $('#admin-pois-error').show();
                setTimeout(function(){
                    if ($('#admin-pois-error').is(":visible"))
                        $('#admin-pois-error').hide();
                }, 30000);
            }
        });
    });
});