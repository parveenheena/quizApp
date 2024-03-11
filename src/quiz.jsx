import React, { useState, useEffect } from 'react';
import { Box, Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Flex } from '@chakra-ui/react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <Text>An error occurred. Please try again later.</Text>;
    }

    return this.props.children;
  }
}

const Quiz = ({ quizParams }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
          if (!quizParams) {
            throw new Error('Quiz parameters not provided');
          }
          const response = await axios.get(`https://opentdb.com/api.php?amount=${quizParams.numQuestions}&category=${quizParams.category}&difficulty=${quizParams.difficulty}&type=multiple`);
          setQuestions(response.data.results);
          setIsLoading(false);
        } catch (error) {
          if (error.response && error.response.status === 429) {
            console.log('Too many requests. Retrying in 5 seconds...');
            setTimeout(fetchData, 5000); 
          } else {
            console.error('Error fetching questions:', error);
            setError(error);
            setIsLoading(false);
          }
        }
      };
      
  
    fetchData();
  }, [quizParams]);
  
  

  const handleAnswer = (answer) => {
    const isCorrect = answer === questions[currentQuestion].correct_answer;
    setUserAnswers({ ...userAnswers, [currentQuestion]: { answer, isCorrect } });
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestion(currentQuestion - 1);
  };

  const handleSubmitQuiz = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  if (questions.length === 0) {
    return <Text>No questions found.</Text>;
  }

  const currentQuestionData = questions[currentQuestion];


  if (!currentQuestionData) {
    if (isLoading) {
      return <Text>Loading...</Text>;
    }
    if (error) {
      return <Text>Error: {error.message}</Text>;
    }
    return <Text>No questions found.</Text>;
  }

  const { question, correct_answer, incorrect_answers } = currentQuestionData;

  const numCorrectAnswers = Object.values(userAnswers).filter((answer) => answer.isCorrect).length;
  const numIncorrectAnswers = Object.values(userAnswers).filter((answer) => !answer.isCorrect).length;
  const totalQuestions = quizParams.numQuestions;
  const percentage = (numCorrectAnswers / totalQuestions) * 100;

  return (
    <Flex minWidth='max-content' alignItems='center' gap='5'>
    <Box maxW="md" borderWidth="1px" borderRadius="lg" p="4">
      <Text fontSize="xl">{question}</Text>
      {incorrect_answers.map((answer, index) => (
        <Flex minWidth='max-content' alignItems='center' gap='10'justifyContent="space-between">
        <Button key={index} variant="outline" colorScheme="teal" onClick={() => handleAnswer(answer)}>
          {answer}
        </Button>
        </Flex>
      ))}
      <Button mt={4} colorScheme="teal" onClick={handleNextQuestion}>
        Next
      </Button>
      {currentQuestion > 0 && (
        <Button mt={4} colorScheme="red" onClick={handlePreviousQuestion}>
          Previous
        </Button>
      )}
      {currentQuestion === questions.length - 1 ? (
        <Button mt={4} colorScheme="blue" onClick={handleSubmitQuiz}>
          Submit
        </Button>
      ) : (
        <Link to="/leaderboard">
          <Button mt={4} colorScheme="yellow">
            View Leaderboard
          </Button>
        </Link>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Quiz Results</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Number of Correct Answers: {numCorrectAnswers}</Text>
            <Text>Number of Incorrect Answers: {numIncorrectAnswers}</Text>
            <Text>Total Score: {score}</Text>
            <Text>Percentage: {percentage}%</Text>
          </ModalBody>
          <ModalFooter>
            <Link to="/leaderboard">
              <Button colorScheme="blue" mr={3}>
                Go to Leaderboard
              </Button>
            </Link>
            <Button onClick={closeModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
    </Flex>
  );
};

export default Quiz;
