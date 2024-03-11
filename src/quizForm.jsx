import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Select, Input } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const QuizForm = ({ onStart }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '9',
    difficulty: 'easy',
    numQuestions: '5',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart(formData); 
    navigate('/quiz');
  };

  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" p="4">
      <form onSubmit={handleSubmit}>
        <FormControl id="name">
          <FormLabel>Your Name</FormLabel>
          <Input type="text" name="name" value={formData.name} onChange={handleChange} />
        </FormControl>
        <FormControl id="category" mt={4}>
          <FormLabel>Category</FormLabel>
          <Select name="category" value={formData.category} onChange={handleChange}>
            <option value="9">General Knowledge</option>
            <option value="21">Sports</option>
            <option value="22">Geography</option>
          </Select>
        </FormControl>
        <FormControl id="difficulty" mt={4}>
          <FormLabel>Difficulty</FormLabel>
          <Select name="difficulty" value={formData.difficulty} onChange={handleChange}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>
        </FormControl>
        <FormControl id="numQuestions" mt={4}>
          <FormLabel>Number of Questions</FormLabel>
          <Input type="number" min="1" max="10" name="numQuestions" value={formData.numQuestions} onChange={handleChange} />
        </FormControl>
        <Button mt={4} colorScheme="teal" type="submit">
          Start Quiz
        </Button>
      </form>
    </Box>
  );
};

export default QuizForm;
