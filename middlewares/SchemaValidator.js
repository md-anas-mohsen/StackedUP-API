class SchemaValidator {
  body(schema) {
    return (req, res, next) => {
      const { error, value } = schema.validate(req.body);

      if (error) {
        return res.status(200).json({
          success: false,
          message: error.details[0]?.message,
        });
      }
      next();
    };
  }
}

module.exports = SchemaValidator;
