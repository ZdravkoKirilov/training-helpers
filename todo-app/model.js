const { z } = require("zod");
const { v4: uuid } = require("uuid");

const parser = z.object({
  id: z.string().uuid(),
  title: z.string().max(100).min(5),
  description: z.string().max(300).min(10).optional().nullable(),
  completed: z.boolean().default(false),
});

let todos = [];

const ErrorTypes = {
  ParsingError: "ParsingError",
  NotFound: "NotFound",
};

class TodoError extends Error {
  constructor(message, errors) {
    super();
    this.name = "TodoError";
    this.message = message;
    this.errors = errors;
  }
}

const TodoModel = {
  create: (source) => {
    source = source || {};
    const parsed = parser.safeParse({
      ...source,
      id: uuid(),
    });

    if (parsed.success) {
      const isTitleTaken = todos.find(
        (elem) => elem.title === parsed.data.title
      );

      if (isTitleTaken) {
        return new TodoError(ErrorTypes.ParsingError, {
          title: "Name is already taken",
        });
      } else {
        todos.push(parsed.data);
        return parsed.data;
      }
    }
    return new TodoError(
      ErrorTypes.ParsingError,
      parsed.error.flatten().fieldErrors
    );
  },

  edit: (payload) => {
    const index = todos.findIndex((elem) => elem.id === payload.id);
    const item = todos[index];

    if (!item) {
      return new TodoError(ErrorTypes.NotFound);
    }

    const parsed = parser.safeParse(payload);

    if (parsed.success) {
      todos[index] = parsed.data;
      return parsed.data;
    }
    return new TodoError(
      ErrorTypes.ParsingError,
      parsed.error.flatten().fieldErrors
    );
  },

  delete: (todoId) => {
    const index = todos.findIndex((elem) => elem.id === todoId);
    const item = todos[index];

    if (!item) {
      return new TodoError(ErrorTypes.NotFound);
    }

    todos[index] = undefined;
    todos = todos.filter(Boolean);

    return undefined;
  },

  getAll() {
    return todos;
  },
};

module.exports = {
  ErrorTypes,
  TodoModel,
};
