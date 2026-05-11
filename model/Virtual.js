class Virtual extends Estudiante {
    constructor(codigoEstudiante, nombresApellidos, programa, notaFinal, modalidadPrograma, plataforma) {
        super(codigoEstudiante, nombresApellidos, programa, notaFinal, modalidadPrograma);
        this.plataforma = plataforma;
    }
}