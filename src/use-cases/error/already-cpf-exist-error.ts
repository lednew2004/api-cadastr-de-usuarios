export class AlreadyCpfExistError extends Error {
    constructor(){
        super("Already exists Cpf");
    };
};