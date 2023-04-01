import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "./api";

export const useQuestions = () => {
  const query = useQuery(["questions"], api.getQuestions);

  const addQuestion = useMutation(api.addQuestion, {
    onSuccess: () => {
      query.refetch();
    },
  });

  const editQuestion = useMutation(api.editQuestion, {
    onSuccess: () => {
      query.refetch();
    },
  });

  const deleteQuestion = useMutation(api.deleteQuestion, {
    onSuccess: () => {
      query.refetch();
    },
  });

  return { query, addQuestion, deleteQuestion, editQuestion };
};
