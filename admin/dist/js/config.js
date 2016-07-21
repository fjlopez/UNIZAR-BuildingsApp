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
        { label: 'Secretaría', value: 'Secretaría'},
        { label: 'Baños', value: 'Baños'},
        { label: 'Cafetería', value: 'Cafetería'},
        { label: 'Reprografía', value: 'Reprografía'},
        { label: 'Conserjería', value: 'Conserjería'},
        { label: 'Biblioteca', value: 'Biblioteca'},
        { label: 'Mini puntos limpios', value: 'Mini puntos limpios'},
        { label: 'Cajero automático', value: 'Cajero automático'},
        { label: 'Departamentos', value: 'Departamentos'},
        { label: 'Acceso especial minusválidos', value: 'Acceso especial minusválidos'},
        { label: 'Ascensores', value: 'Ascensores'},
        { label: 'Aparcamiento Haz Dedo', value: 'Aparcamiento Haz Dedo'},
        { label: 'Aparcamiento minusválido', value: 'Aparcamiento minusválido'},
        { label: 'Aparcamiento bicicletas', value: 'Aparcamiento bicicletas'}
    ];

constants.cities = [
        { label: 'Zaragoza', value: 'Zaragoza', id: 1},
        { label: 'Huesca', value: 'Huesca', id: 2},
        { label: 'Teruel', value: 'Teruel', id: 3}
    ];

function getConstants(key){
    return constants[key];
};