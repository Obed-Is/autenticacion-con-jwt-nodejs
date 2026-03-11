const nameInput = document.getElementById('nombre');
const lastNameInput = document.getElementById('apellido');
const userInput = document.getElementById('usuario');
const passInput = document.getElementById('contraseña');
const msjRespuesta = document.querySelector('.txt-error');

const btnRegistro = document.getElementById('btn-reg');

btnRegistro.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const username = userInput.value.trim();
    const password = passInput.value;

    if (!name || !username || !password) {
        return msjRespuesta.innerHTML = "Todos los campos son obligatorios.";
    }

    if (name.length < 3) {
        return msjRespuesta.innerHTML = "El nombre debe tener al menos 3 caracteres.";
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return msjRespuesta.innerHTML = "El nombre solo debe contener letras y espacios.";
    }

    if (username.length < 4) {
        return msjRespuesta.innerHTML = "El usuario debe tener al menos 4 caracteres.";
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return msjRespuesta.innerHTML = "El usuario solo puede contener letras, números y guiones bajos.";
    }

    if (password.length < 4) {
        return msjRespuesta.innerHTML = "La contraseña debe tener al menos 4 caracteres.";
    }

    msjRespuesta.innerHTML = ""; // Limpiar errores previos
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