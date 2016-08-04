var constants_dev = {
    "API_URL":"http://localhost:8080"
};

var constants_prod = {
    "API_URL":"production_api_url"
};

var constants;
if (window.location.hostname === 'localhost') constants = constants_dev;
else constants = constants_prod;

constants.categories = [
        { label: 'Secretaría', value: 'secretaria'},
        { label: 'Baños', value: 'bathroom'},
        { label: 'Cafetería', value: 'cafeteria'},
        { label: 'Reprografía', value: 'reprografia'},
        { label: 'Conserjería', value: 'conserjeria'},
        { label: 'Biblioteca', value: 'biblioteca'},
        { label: 'Mini puntos limpios', value: 'mini-punto-limpio'},
        { label: 'Cajero automático', value: 'cajero'},
        { label: 'Departamentos', value: 'departamento'},
        { label: 'Acceso especial minusválidos', value: 'acceso-minusvalidos'},
        { label: 'Ascensores', value: 'ascensor'},
        { label: 'Aparcamiento Haz Dedo', value: 'aparcamiento-haz-dedo'},
        { label: 'Aparcamiento minusválido', value: 'aparcamiento-minusvalido'},
        { label: 'Aparcamiento bicicletas', value: 'aparcamiento-bicicletas'}
    ];

constants.cities = [
        { label: 'Zaragoza', value: 'Zaragoza', id: 1},
        { label: 'Huesca', value: 'Huesca', id: 2},
        { label: 'Teruel', value: 'Teruel', id: 3}
    ];

function getConstants(key){
    return constants[key];
};