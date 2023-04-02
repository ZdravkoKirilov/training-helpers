import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Question, api } from "./api";

const cacheKey = ["questions"];

export const useQuestions = () => {
  const client = useQueryClient();

  const query = useQuery(cacheKey, api.getQuestions, {
    refetchOnWindowFocus: false,
  });

  const existingQuestions = client.getQueryData<Question[]>(cacheKey) || [];

  const addQuestion = useMutation(api.addQuestion, {
    onSuccess: (response) => {
      client.setQueryData(cacheKey, [...existingQuestions, response]);
    },
  });

  const editQuestion = useMutation(api.editQuestion, {
    onSuccess: (response) => {
      client.setQueryData(
        cacheKey,
        existingQuestions.map((question) =>
          question.id === response.id ? response : question
        )
      );
    },
  });

  const deleteQuestion = useMutation(api.deleteQuestion, {
    onSuccess: () => {
      client.setQueryData(
        cacheKey,
        existingQuestions.filter(
          (question) => question.id !== deleteQuestion.variables
        )
      );
    },
  });

  const saveQuestions = useMutation(api.saveQuestions, {
    onSuccess: (response) => {
      client.setQueryData(cacheKey, response);
    },
  });

  return { query, addQuestion, deleteQuestion, editQuestion, saveQuestions };
};
