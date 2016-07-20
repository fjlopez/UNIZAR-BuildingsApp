var i18n = {
    'editor':{
    	'es': {
    		loadingRecords: 'Cargando...',
    		zeroRecords: 'No hay elementos para mostrar',
    		search: 'Buscar:',
    		create: {
    			button: 'Nuevo',
    			title: 'Crear nuevo punto de interés',
    			submit: 'Crear'
    		},
    		edit: {
    			button: 'Editar',
    			title: 'Editar nuevo punto de interés',
    			submit: 'Guardar'
    		},
    		remove: {
    			button: 'Eliminar',
    			title: 'Eliminar punto de interés',
    			submit: 'Eliminar',
    			confirm: {
            '_': '¿Estás seguro de que quieres eliminar el punto de interés?'
        	}
    		}
    	}
    }
};

var language = 'es';

function getTranslation(key){
    var translation =  i18n[key];
    return translation[language];
};