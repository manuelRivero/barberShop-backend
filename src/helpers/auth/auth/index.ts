import jwt from "jsonwebtoken";
export const generatejWT = (uid = '', role="user") => {
    return new Promise((resolve, reject) => {
        const payload = { uid, role };
        jwt.sign(payload,`${process.env.SECRETORPRIVATEKEY}`, {
            expiresIn: '1m'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        });
    });
}

export const generateRefreshJWT = (uid: any, role: any) => {
    return new Promise((resolve, reject) => {
        const payload = { uid, role };
        jwt.sign(payload,`${process.env.REFRESH_SECRETORPRIVATEKEY}`, {
            expiresIn: '2m'
        }, (err, tokenRefresh) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(tokenRefresh);
            }
        });
    });
}
