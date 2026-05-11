class Virtual extends Estudiante {
    constructor(codigoEstudiante, nombresApellidos, programa, notaFinal, modalidadPrograma, plataforma) {
        super(codigoEstudiante, nombresApellidos, programa, notaFinal, modalidadPrograma);
        this.plataforma = plataforma;
    }

    calcularNotaDefinitiva() {
        return parseFloat(this.notaFinal) + 0.3;
    }
}
