export class ValidationError extends TypeError {
  constructor(fieldErros) {
    super();
    this.fieldErros = fieldErros;
  }
}

export function validation(form) {
  const errors = {};
  const fields = {};

  for (const input of form.elements) {
    if (input.name) {
      fields[input.name] = input.value.trim();
    }
  }

  if (
    (fields.card < 2 && fields.card !== '') ||
    fields.card > 10 ||
    fields.card % 2
  ) {
    errors.name = 'Введите чётное положительное число от 2 до 10';
  }

  if (Object.keys(errors).length) {
    throw new ValidationError(errors);
  }
}
