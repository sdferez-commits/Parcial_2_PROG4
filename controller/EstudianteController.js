document.addEventListener("DOMContentLoaded", MostrarEstudiantes);

function AgregarEstudiante(){
    let estudiante = new Estudiante(
        document.getElementById('codigoEstudiante').value,
        document.getElementById('nombresApellidos').value,
        document.getElementById('programa').value,
        document.getElementById('notaFinal').value,
        document.getElementById('modalidadPrograma').value,
    );
    
    let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];
    estudiantes.push(estudiante);
    localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
    MostrarEstudiantes();
    alert("Estudiante creado exitosamente...");

}

function BuscarEstudiante(codigoEstudiante){
    let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];
    return estudiantes.find(est => String(est.codigoEstudiante) === String(codigoEstudiante));
}

function EliminarEstudiante(codigoEstudiante){
    let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];
    estudiantes = estudiantes.filter(est => est.codigoEstudiante !== codigoEstudiante);
    localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
    MostrarEstudiantes();
    alert("Estudiante eliminado exitosamente...");
}

function ActualizarEstudiante(codigo){
    let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];
    let estudianteIndex = estudiantes.findIndex(est => est.codigoEstudiante === codigo);
    if (estudianteIndex !== -1) {
        estudiantes[estudianteIndex] = new Estudiante(
            document.getElementById('codigoEstudiante').value,
            document.getElementById('nombresApellidos').value,
            document.getElementById('programa').value,
            document.getElementById('notaFinal').value,
            document.getElementById('modalidadPrograma').value,
            document.getElementById('salonPlataforma').value
        );
        localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
        MostrarEstudiantes();
    } else {
        alert("Estudiante no encontrado");
    }
}

function CargarEstudianteEnFormulario(codigo) {
    let estudiante = BuscarEstudiante(codigo);
    if (estudiante) {
        document.getElementById('codigoEstudiante').value = estudiante.codigoEstudiante;
        document.getElementById('codigoEstudiante').readOnly = true; 
        document.getElementById('nombresApellidos').value = estudiante.nombresApellidos;
        document.getElementById('programa').value = estudiante.programa;
        document.getElementById('notaFinal').value = estudiante.notaFinal;
        document.getElementById('modalidadPrograma').value = estudiante.modalidadPrograma;
        document.getElementById('salonPlataforma').value = estudiante.salonPlataforma;
        document.getElementById("TituloAgregar").textContent = "Actualizar Estudiante";
        document.getElementById("botonAgregar").textContent = "Actualizar";
        document.getElementById("botonAgregar").onclick = function() {
            ActualizarEstudiante(codigo);
            OcultarFormulario();
        };
    } else {
        alert("Estudiante no encontrado");
    }
}

function MostrarEstudiantes() {
    let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];
    let tbody = document.querySelector("#tablaEstudiantes tbody");
    tbody.innerHTML = "";

    estudiantes.forEach((est, index) => {
        let fila = `<tr>
            <td>${est.codigoEstudiante}</td>
            <td>${est.nombresApellidos}</td>
            <td>${est.programa}</td>
            <td>${est.notaFinal}</td>
            <td>${est.modalidadPrograma}</td>
            <td>${Definitiva(est.codigoEstudiante)}</td>
            <td>
                <button class="btn btn-warning btn-sm" 
                    onclick="MostrarFormulario(); CargarEstudianteEnFormulario('${est.codigoEstudiante}'); ">
                    Actualizar
                </button>
            </td>
            <td>
                <button class="btn btn-danger btn-sm" 
                    onclick="EliminarEstudiante('${est.codigoEstudiante}')">
                    Eliminar
                </button>
            </td>
        </tr>`;
        tbody.innerHTML += fila;
    });

    CalcularPromedioGrupo();
}

function Definitiva(codigoEstudiante) {
    let estudiante = BuscarEstudiante(codigoEstudiante);
    if (!estudiante) return "N/A";

    let nota = parseFloat(estudiante.notaFinal);
    if (estudiante.modalidadPrograma === "Virtual") {
        return (nota + 0.3).toFixed(2);
    } else if (estudiante.modalidadPrograma === "Presencial") {
        return (nota + 0.5).toFixed(2);
    }

    return nota.toFixed(2);
}

function CalcularPromedioGrupo() {
    let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];
    let sumaNotas = estudiantes.reduce((acc, est) => acc + parseFloat(est.notaFinal), 0);
    let promedio = estudiantes.length > 0 ? sumaNotas / estudiantes.length : 0;
    document.getElementById("promedioGrupo").textContent = promedio.toFixed(2);
}

