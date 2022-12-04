export const errorStrings = {
    NO_USER: { msg: 'No exite el usuario', code: 401, rx: /No exite el usuario/ },
    FIELD_REQUIRED: { msg: 'El :attribute es obligatorio', code: 400, rx: /El \w* es obligatorio/ },
    INVALID_FIELD: { msg: ':attribute invalido', code: 400, rx: /\w* invalido/ },
    WRONG_PASSWORD: { msg: 'Contraseña incorrecta', code: 401, rx: /Contraseña incorrecta/ },
    INVALID_SESSION: { msg: 'Sesion invalida', code: 401, rx: /Sesion invalida/ },
    EXISTING_USER: { msg: 'El usuario ya existe', code: 401, rx: /El usuario ya existe/ }
}

export function getErrorCode(msg) {
    const keys = Object.keys(errorStrings);

    for(let key of keys){
        if(errorStrings[key].rx.test(msg))
            return errorStrings[key].code
    }

    return 500;
}

export default errorStrings;