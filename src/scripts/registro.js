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

        const durationAccessToken = res.tokensDuration.accessToken;
        const durationRefreshToken = res.tokensDuration.refreshToken;
        localStorage.setItem('durationAccessToken', Date.now() + durationAccessToken);
        localStorage.setItem('durationRefreshToken', Date.now() + durationRefreshToken);

        //solo redirije hacia home para detectar la sesion luego de que se procese la peticion
        window.location.href = "/home";
    } catch (error) {
        msjRespuesta.innerHTML = "Ocurrio un error al intentar registrarse";
    }
}