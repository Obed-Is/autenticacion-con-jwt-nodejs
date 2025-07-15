const nameInput = document.getElementById('nombre');
const lastNameInput = document.getElementById('apellido');
const userInput = document.getElementById('usuario');
const passInput = document.getElementById('contraseña');
const msjRespuesta = document.querySelector('.txt-error');

const btnRegistro = document.getElementById('btn-reg');

btnRegistro.addEventListener('click', () => {
    const name = nameInput.value;
    const lastName = lastNameInput.value;
    const username = userInput.value;
    const password = passInput.value;

    if (!username || !password || !name || !lastName) return msjRespuesta.innerHTML = "Para completar el registro ingrese sus credenciales";

    registerUser(name, lastName, username, password);
})

async function registerUser(name, lastName, username, password) {
    try {
        const ftReg = await fetch('/register/user', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({ name, lastName, username, password })
        })

        const res = await ftReg.json();

        if (!ftReg.ok) {
            return msjRespuesta.innerHTML = res.message;
        };

        if (res.success) {
            msjRespuesta.innerHTML = res.message;
            console.log(res.accessToken)
            window.location.href = "/protected";
        }

    } catch (error) {
        console.log(error)
        msjRespuesta.innerHTML = "Ocurrio un error al intentar registrarse";
    }
}

// async function cambiarPagina(token) {
//     try {
//         const response = await fetch(`/protected`, {
//             headers: {
//                 authorization: `Bearer ${token}`
//             }
//         });

//         if (!response.ok) {
//             return msjRespuesta.innerHTML = response.msg;
//         }

//     } catch (error) {
//         console.log(error);
//         return msjRespuesta.innerHTML = error.message || "Ocurrio un error al iniciar la sesion";
//     }

// }