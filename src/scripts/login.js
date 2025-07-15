const userInput = document.getElementById('usuario');
const passInput = document.getElementById('contraseña');
const pErrorMsj = document.querySelector('.txt-error');

const btnLogin = document.getElementById('btn-log');

btnLogin.addEventListener('click', () => {
    const username = userInput.value;
    const password = passInput.value;

    if (!username || !password) return pErrorMsj.innerHTML = "Para poder acceder debe ingresar sus credenciales";

    loginUser(username, password)
})

async function loginUser(username, pass) {
    try {
        const ftLog = await fetch("/login/user", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ username, pass })
        });

        if (!ftLog.ok) return pErrorMsj.innerHTML = "Ocurrio un error al intentar iniciar la sesion";

        const res = await ftLog.json();

        console.log(res)
    } catch (err) {
        console.log(err)
        pErrorMsj.innerHTML = "Ocurrio un error al intentar iniciar la sesion";
    }
}