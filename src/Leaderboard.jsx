import React, { useState, useEffect } from 'react';
import { Box, Text, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/leaderboard')
      .then(response => {
        setLeaderboardData(response.data);
      })
      .catch(error => {
        console.error('Error fetching leaderboard data:', error);
      });
  }, []);

  return (
    <Box maxW="md" borderWidth="1px" borderRadius="lg" p="4">
      <Text fontSize="xl" mb="4">Leaderboard</Text>
      <Table variant="striped" colorScheme="blue">
        <Thead>
          <Tr>
            <Th>Rank</Th>
            <Th>Name</Th>
            <Th>Score</Th>
          </Tr>
        </Thead>
        <Tbody>
          {leaderboardData.map((entry, index) => (
            <Tr key={index}>
              <Td>{index + 1}</Td>
              <Td>{entry.name}</Td>
              <Td>{entry.score}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Leaderboard;
