class Contrato extends Estudiante {
    constructor(codigoEstudiante, nombresApellidos, programa, notaFinal, modalidadPrograma, salon) {
        super(codigoEstudiante, nombresApellidos, programa, notaFinal, modalidadPrograma);
        this.salon = salon;
    }
}