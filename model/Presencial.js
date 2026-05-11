class Presencial extends Estudiante {
    constructor(codigoEstudiante, nombresApellidos, programa, notaFinal, modalidadPrograma, salon) {
        super(codigoEstudiante, nombresApellidos, programa, notaFinal, modalidadPrograma);
        this.salon = salon;
    }

    calcularNotaDefinitiva() {
        return parseFloat(this.notaFinal) + 0.5;
    }
}
