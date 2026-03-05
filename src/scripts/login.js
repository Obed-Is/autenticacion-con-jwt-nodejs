const userInput = document.getElementById('usuario');
const passInput = document.getElementById('contraseña');
const pErrorMsj = document.querySelector('.txt-error');

const btnLogin = document.getElementById('btn-log');

btnLogin.addEventListener('click', async () => {
    const username = userInput.value;
    const password = passInput.value;

    if (!username || !password) return pErrorMsj.textContent = "Para poder acceder debe ingresar sus credenciales";

    await loginUser(username, password)
})

async function loginUser(username, pass) {
    try {
        const ftLog = await fetch("/login", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ username, pass })
        });

        const res = await ftLog.json();
        console.log(res)
        if (!res.success) {
            return pErrorMsj.textContent = res.message;
        }

        return window.location.href = "/home";
    } catch (err) {
        console.log(err)
        pErrorMsj.innerHTML = "Ocurrio un error al intentar iniciar la sesion";
    }
}