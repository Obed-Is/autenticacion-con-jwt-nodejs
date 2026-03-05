const nameInput = document.getElementById('nombre');
const lastNameInput = document.getElementById('apellido');
const userInput = document.getElementById('usuario');
const passInput = document.getElementById('contraseña');
const msjRespuesta = document.querySelector('.txt-error');

const btnRegistro = document.getElementById('btn-reg');

btnRegistro.addEventListener('click', () => {
    const name = nameInput.value;
    const username = userInput.value;
    const password = passInput.value;

    //aqui solo se valida de manera basica que los campos no esten vacios
    if (!username || !password || !name) return msjRespuesta.innerHTML = "Para completar el registro ingrese sus credenciales";

    registerUser(name, username, password);
})

async function registerUser(name, username, password) {
    try {
        const request = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({ name, username, password })
        })

        const res = await request.json();

        if (!request.ok) return msjRespuesta.innerHTML = res.message;

        if (!res.success) return msjRespuesta.innerHTML = "Ocurrio un error al intentar iniciar sesion";

        //solo redirije hacia home para detectar la sesion luego de que se procese la peticion
        window.location.href = "/home";
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