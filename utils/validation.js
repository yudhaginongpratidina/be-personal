class Validation {
    static validate(schema, data) {
        return schema.parse(data);
    }
}

export default Validation;