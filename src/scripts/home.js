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

        await Swal.fire("Sesion cerrada", "Tu sesion ha sido cerrada correctamente", "success");
        window.location.href = '/home';
    }
}