

class AppError extends Error {
    constructor(mesaage, status){
        super(mesaage);
        this.status = status;
    }
}


export default AppError;
