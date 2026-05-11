document.addEventListener("DOMContentLoaded", () => {
    MostrarEstudiantes();
    ConfigurarCampoModalidad();
});

// Muestra u oculta el campo salon/plataforma según la modalidad seleccionada
function ConfigurarCampoModalidad() {
    const select = document.getElementById('modalidadPrograma');
    select.addEventListener('change', ActualizarLabelSalonPlataforma);
    ActualizarLabelSalonPlataforma();
}

function ActualizarLabelSalonPlataforma() {
    const modalidad = document.getElementById('modalidadPrograma').value;
    const label = document.getElementById('labelSalonPlataforma');
    const input = document.getElementById('salonPlataforma');

    if (modalidad === 'P') {
        label.textContent = 'Salón:';
        input.placeholder = 'Ej: Aula 101';
    } else {
        label.textContent = 'Plataforma:';
        input.placeholder = 'Ej: Moodle, Teams';
    }
}

function AgregarEstudiante() {
    const codigo       = document.getElementById('codigoEstudiante').value.trim();
    const nombres      = document.getElementById('nombresApellidos').value.trim();
    const programa     = document.getElementById('programa').value.trim();
    const notaFinal    = document.getElementById('notaFinal').value;
    const modalidad    = document.getElementById('modalidadPrograma').value;
    const salonPlat    = document.getElementById('salonPlataforma').value.trim();

    if (!codigo || !nombres || !programa || !notaFinal) {
        alert("Por favor complete todos los campos obligatorios.");
        return;
    }

    // ✅ Instanciar la clase correcta según la modalidad
    let estudiante;
    if (modalidad === 'P') {
        estudiante = new Presencial(codigo, nombres, programa, notaFinal, modalidad, salonPlat);
    } else {
        estudiante = new Virtual(codigo, nombres, programa, notaFinal, modalidad, salonPlat);
    }

    let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];
    estudiantes.push(estudiante);
    localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
    MostrarEstudiantes();
    alert("Estudiante creado exitosamente...");
}

function BuscarEstudiante(codigoEstudiante) {
    let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];
    return estudiantes.find(est => String(est.codigoEstudiante) === String(codigoEstudiante));
}

function EliminarEstudiante(codigoEstudiante) {
    if (!confirm("¿Está seguro de eliminar este estudiante?")) return;
    let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];
    estudiantes = estudiantes.filter(est => est.codigoEstudiante !== codigoEstudiante);
    localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
    MostrarEstudiantes();
    alert("Estudiante eliminado exitosamente...");
}

function ActualizarEstudiante(codigo) {
    let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];
    let idx = estudiantes.findIndex(est => est.codigoEstudiante === codigo);

    if (idx !== -1) {
        const modalidad = document.getElementById('modalidadPrograma').value;
        const salonPlat = document.getElementById('salonPlataforma').value.trim();

        // ✅ Instanciar clase correcta al actualizar también
        let actualizado;
        if (modalidad === 'P') {
            actualizado = new Presencial(
                document.getElementById('codigoEstudiante').value,
                document.getElementById('nombresApellidos').value,
                document.getElementById('programa').value,
                document.getElementById('notaFinal').value,
                modalidad,
                salonPlat
            );
        } else {
            actualizado = new Virtual(
                document.getElementById('codigoEstudiante').value,
                document.getElementById('nombresApellidos').value,
                document.getElementById('programa').value,
                document.getElementById('notaFinal').value,
                modalidad,
                salonPlat
            );
        }

        estudiantes[idx] = actualizado;
        localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
        MostrarEstudiantes();
        alert("Estudiante actualizado exitosamente...");
    } else {
        alert("Estudiante no encontrado");
    }
}

function CargarEstudianteEnFormulario(codigo) {
    let estudiante = BuscarEstudiante(codigo);
    if (estudiante) {
        document.getElementById('codigoEstudiante').value       = estudiante.codigoEstudiante;
        document.getElementById('codigoEstudiante').readOnly    = true;
        document.getElementById('nombresApellidos').value       = estudiante.nombresApellidos;
        document.getElementById('programa').value               = estudiante.programa;
        document.getElementById('notaFinal').value              = estudiante.notaFinal;
        document.getElementById('modalidadPrograma').value      = estudiante.modalidadPrograma;
        // salon o plataforma se guarda en el mismo campo salonPlataforma
        document.getElementById('salonPlataforma').value        = estudiante.salon || estudiante.plataforma || '';

        ActualizarLabelSalonPlataforma();

        document.getElementById("TituloAgregar").textContent    = "Actualizar Estudiante";
        document.getElementById("botonAgregar").textContent     = "Actualizar";
        document.getElementById("botonAgregar").onclick = function () {
            ActualizarEstudiante(codigo);
            OcultarFormulario();
        };
    } else {
        alert("Estudiante no encontrado");
    }
}

// ✅ Calcula notaDefinitiva usando la clase correcta
function ObtenerNotaDefinitiva(est) {
    let obj;
    if (est.modalidadPrograma === 'P') {
        obj = Object.assign(new Presencial(), est);
    } else {
        obj = Object.assign(new Virtual(), est);
    }
    return obj.calcularNotaDefinitiva();
}

function MostrarEstudiantes() {
    let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];
    let tbody = document.querySelector("#tablaEstudiantes tbody");
    tbody.innerHTML = "";

    estudiantes.forEach(est => {
        const definitiva = ObtenerNotaDefinitiva(est).toFixed(2);
        const salonPlat  = est.salon || est.plataforma || '-';

        const modalidadTexto = est.modalidadPrograma === 'P' ? 'Presencial' : 'Virtual';

        let fila = `<tr>
            <td>${est.codigoEstudiante}</td>
            <td>${est.nombresApellidos}</td>
            <td>${est.programa}</td>
            <td>${parseFloat(est.notaFinal).toFixed(2)}</td>
            <td>${modalidadTexto}</td>
            <td>${salonPlat}</td>
            <td><strong>${definitiva}</strong></td>
            <td>
                <button class="btn btn-warning btn-sm"
                    onclick="MostrarFormulario(); CargarEstudianteEnFormulario('${est.codigoEstudiante}');">
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

    hallarPromedioGrupo();
}

// ✅ Promedio calculado sobre notaDefinitiva, no notaFinal
function hallarPromedioGrupo() {
    let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];
    if (estudiantes.length === 0) {
        document.getElementById("promedioGrupo").textContent = "0.00";
        return;
    }
    let sumaDefinitivas = estudiantes.reduce((acc, est) => acc + ObtenerNotaDefinitiva(est), 0);
    let promedio = sumaDefinitivas / estudiantes.length;
    document.getElementById("promedioGrupo").textContent = promedio.toFixed(2);
}
