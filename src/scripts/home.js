const logout = async () => {
    const alerta = await Swal.fire({
        title: "¿Estas seguro de cerrar sesion?",
        text: "Se cerrara tu sesion actual",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Cerrar sesion",
        cancelButtonText: "Cancelar",
    });

    if (alerta.isConfirmed) {
        const request = await fetch("/logout", {
            method: "POST",
        });

        if (!request.ok) {
            await Swal.fire("Error", "Ocurrio un error al cerrar sesion", "error");
            return;
        }

        localStorage.removeItem('durationAccessToken');
        localStorage.removeItem('durationRefreshToken');

        await Swal.fire("Sesion cerrada", "Tu sesion ha sido cerrada correctamente", "success");
        window.location.href = '/home';
    }
}

/**
 * Actualiza el tiempo restante del token de acceso y del token de refresco
 */
async function actualizarTimer() {
    if (!localStorage.getItem('durationAccessToken')) {
        await obtenerTimerToken();
    }

    const elemAccessToken = document.getElementById('accessToken');
    const elemRefreshToken = document.getElementById('refreshToken');

    const durationAccessToken = localStorage.getItem('durationAccessToken');
    const durationRefreshToken = localStorage.getItem('durationRefreshToken');

    const accessTokenRestante = Math.max(0, Math.floor((durationAccessToken - Date.now()) / 1000));
    const refreshTokenRestante = Math.floor((durationRefreshToken - Date.now()) / 1000);

    if (elemAccessToken === null || elemRefreshToken === null) {
        localStorage.removeItem('durationAccessToken');
        localStorage.removeItem('durationRefreshToken');
        return;
    }


    const minutosAccessToken = Math.floor(accessTokenRestante / 60);
    const segundosAccessToken = accessTokenRestante % 60;
    const minutosRefreshToken = Math.floor(refreshTokenRestante / 60);
    const segundosRefreshToken = refreshTokenRestante % 60;

    if (accessTokenRestante <= 0) {
        localStorage.removeItem('durationAccessToken');
        elemAccessToken.classList.add('expired');
        elemAccessToken.textContent = "El token de acceso ha expirado";
    } else {
        elemAccessToken.classList.remove('expired');
        elemAccessToken.textContent = `${minutosAccessToken.toString().padStart(2, '0')}:${segundosAccessToken.toString().padStart(2, '0')}`;
    }

    if (refreshTokenRestante <= 0) {
        clearInterval(intervalToken);
        elemRefreshToken.classList.add('expired');
        return elemRefreshToken.textContent = "El token de refresco ha expirado, por favor recargar la pagina";
    } else {
        elemRefreshToken.classList.remove('expired');
        elemRefreshToken.textContent = `${minutosRefreshToken.toString().padStart(2, '0')}:${segundosRefreshToken.toString().padStart(2, '0')}`;
    }
}

actualizarTimer();
const intervalToken = setInterval(actualizarTimer, 1000);

/**
 * Hace una llamada al servidor para obtener el tiempo del token de acceso expirado
 */
async function obtenerTimerToken() {
    try {
        const request = await fetch("/get-timer-token", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const response = await request.json();
        if (!response.success) {
            await Swal.fire("Error", "Ocurrio un error al obtener el tiempo del token de acceso expirado", "error");
            return window.location.href = '/home';
        }

        if (response.success) {
            localStorage.setItem(
                'durationAccessToken',
                String(Date.now() + response.durationAccessToken)
            );
            return;
        }
    } catch (error) {
        console.log(error)
        return;
    }
}

console.warn(`
███╗   ██╗ ██████╗     ████████╗ ██████╗  ██████╗ ██╗   ██╗███████╗ ███████╗
████╗  ██║██╔═══██╗    ╚══██╔══╝██╔═══██╗██╔═══██╗██║   ██║██╔════╝ ██╔════╝
██╔██╗ ██║██║   ██║       ██║   ██║   ██║██║   ██║██║   ██║█████╗   ███████╗
██║╚██╗██║██║   ██║       ██║   ██║   ██║██║▄▄ ██║██║   ██║██╔══╝   ╚════██║
██║ ╚████║╚██████╔╝       ██║   ╚██████╔╝╚██████╔╝╚██████╔╝███████╗ ███████║
╚═╝  ╚═══╝ ╚═════╝        ╚═╝    ╚═════╝  ╚══▀▀═╝  ╚═════╝ ╚══════╝ ╚══════╝

                ██████╗ ██╗   ██╗███████╗      
               ██╔═══██╗██║   ██║██╔════╝
               ██║   ██║██║   ██║█████╗  
               ██║▄▄ ██║██║   ██║██╔══╝  
               ╚██████╔╝╚██████╔╝███████╗
                ╚══▀▀═╝  ╚═════╝ ╚══════╝
████████╗███████╗
╚══██╔══╝██╔════╝
   ██║   █████╗  
   ██║   ██╔══╝  
   ██║   ███████╗
   ╚═╝   ╚══════╝
                      ██╗   ██╗███████╗ ██████╗
                      ██║   ██║██╔════╝██╔═══██╗
                      ██║   ██║█████╗  ██║   ██║
                      ╚██╗ ██╔╝██╔══╝  ██║   ██║
                       ╚████╔╝ ███████╗╚██████╔╝
                        ╚═══╝  ╚══════╝ ╚═════╝ 👀
    `);