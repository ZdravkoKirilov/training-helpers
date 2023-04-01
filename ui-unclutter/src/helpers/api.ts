import { pipe } from "lodash/fp";

export type CreateQuestionDto = {
  title: string;
  points: number;
};

export type UpdateQuestionDto = CreateQuestionDto & {
  id: string;
};

export type Question = UpdateQuestionDto & {
  createdAt: Date;
  updatedAt?: Date;
};

let questions = [] as Question[];
const currentId = 0;

const getQuestions = () => {
  return questions;
};

const addQuestion = (dto: CreateQuestionDto): Question => {
  currentId + 1;

  const newQuestion = {
    ...dto,
    id: String(currentId),
    createdAt: new Date(),
  };

  questions.push(newQuestion);

  return newQuestion;
};

const editQuestion = (dto: UpdateQuestionDto): Question => {
  const existingQuestion = questions.find((question) => question.id === dto.id);

  if (!existingQuestion) {
    throw new Error("Question not found.");
  }

  const updatedQuestion = {
    ...existingQuestion,
    ...dto,
  };

  questions = questions.map((question) =>
    question.id === dto.id ? updatedQuestion : question
  );

  return updatedQuestion;
};

const deleteQuestion = (id: Question["id"]): void => {
  const existingQuestion = questions.find((question) => question.id === id);

  if (!existingQuestion) {
    throw new Error("Question not found.");
  }

  questions = questions.filter((question) => question.id !== id);

  return undefined;
};

function withFail<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = Math.floor(Math.random() * options.length);
    const shouldFail = result === 1;

    if (shouldFail) {
      throw new Error("Unexpected error");
    }

    return fn(...args);
  };
}

function withDelay<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const delay = [100, 300, 600, 1100, 2000][Math.floor(Math.random() * 5)];

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(fn(...args));
      }, delay);
    });
  };
}

const withDelayAndFailures = pipe(withDelay, withFail);

export const api = {
  addQuestion: withDelayAndFailures(addQuestion),
  getQuestions: withDelayAndFailures(getQuestions),
  editQuestion: withDelayAndFailures(editQuestion),
  deleteQuestion: withDelayAndFailures(deleteQuestion),
};
