function MostrarFormulario() {
    let div = document.getElementById("divAgregarEstudiante");
    div.style.display = 'block';
}

function OcultarFormulario() {
    let div = document.getElementById("divAgregarEstudiante");
    div.style.display = 'none';
    NormalizarFormulario();
    LimpiarFormulario();
}

function LimpiarFormulario() {
    document.getElementById("formEstudiante").reset();
    ActualizarLabelSalonPlataforma();
}

function NormalizarFormulario() {
    document.getElementById("TituloAgregar").textContent = "Agregar Estudiante";
    document.getElementById("botonAgregar").textContent = "Guardar Estudiante";
    document.getElementById("botonAgregar").onclick = function () {
        AgregarEstudiante();
        OcultarFormulario();
    };
    document.getElementById('codigoEstudiante').readOnly = false;
}
