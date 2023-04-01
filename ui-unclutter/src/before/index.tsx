import { FC } from "react";
import {
  AppBar,
  Container,
  Stack,
  Box,
  Typography,
  Fab,
  CircularProgress,
  Alert,
  Card,
} from "@mui/material";
import { Add } from "@mui/icons-material";

import { CreateQuestionDto, useQuestions } from "../helpers";
import UpsertForm from "./upsert.form";

const InitialQuizForm: FC = () => {
  const { query, addQuestion } = useQuestions();

  if (query.isLoading) {
    return (
      <Stack>
        <CircularProgress />
        <Alert severity="info">Loading questions...</Alert>
      </Stack>
    );
  }

  if (query.isError) {
    return <Alert severity="error">Something went wrong.</Alert>;
  }

  const handleAddQuestion = (dto: CreateQuestionDto) => {
    addQuestion.mutate(dto);
  };

  return (
    <Box component="main">
      <AppBar sx={{ p: 2 }} position="static">
        <Typography variant="h4" component="h1" textAlign="center">
          3Via
        </Typography>
      </AppBar>

      <Container>
        <Stack gap={3} p={2}>
          <Stack
            component="header"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            flexWrap="wrap"
          >
            <Typography component="h2" variant="h5">
              Questions
            </Typography>
            <Box>
              <Fab color="secondary" variant="extended">
                <Add />
                Add
              </Fab>
            </Box>
          </Stack>

          <UpsertForm
            isLoading={addQuestion.isLoading}
            error={addQuestion.error ? "Something went wrong" : ""}
            onSubmit={handleAddQuestion}
          />

          <Stack gap={2}>
            {query.data.length === 0 && (
              <Alert severity="info">No questions yet.</Alert>
            )}

            {query.data.map((question) => (
              <Card key={question.id}>
                <Stack sx={{ p: 2 }}>{question.title}</Stack>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default InitialQuizForm;
