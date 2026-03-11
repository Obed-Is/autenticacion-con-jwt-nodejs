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
        if (!res.success) {
            return pErrorMsj.textContent = res.message;
        }

        const durationAccessToken = res.tokensDuration.accessToken;
        const durationRefreshToken = res.tokensDuration.refreshToken;
        localStorage.setItem('durationAccessToken', Date.now() + durationAccessToken);
        localStorage.setItem('durationRefreshToken', Date.now() + durationRefreshToken);

        return window.location.href = "/home";
    } catch (err) {
        pErrorMsj.innerHTML = "Ocurrio un error al intentar iniciar la sesion";
    }
}