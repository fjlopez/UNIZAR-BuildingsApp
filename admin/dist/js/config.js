var constants_dev = {
    "API_URL":"http://localhost:8080"
};

var constants_prod = {
    "API_URL":"production_api_url"
};

var constants;
if (window.location.hostname === 'localhost') constants = constants_dev;
else constants = constants_prod;

function getConstants(key){
    return constants[key];
};