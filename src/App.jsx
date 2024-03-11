import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { ChakraProvider, Container } from '@chakra-ui/react';
import QuizForm from './quizForm';
import Quiz from './quiz';
import Leaderboard from './Leaderboard';

const App = () => {
  const [quizParams, setQuizParams] = useState(null);

  const handleStartQuiz = (formData) => {
    setQuizParams(formData);
  };

  return (
    <ChakraProvider>
      <Router>
        <Container mt="4">
          <Routes>
            <Route path="/" element={<QuizForm onStart={handleStartQuiz} />} />
            <Route path="/quiz" element={<Quiz quizParams={quizParams} />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </Container>
      </Router>
    </ChakraProvider>
  );
};

export default App;
