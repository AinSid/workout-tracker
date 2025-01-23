import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Tracker from './pages/Tracker';
import History from './pages/History';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, 
    #ffffff 0%,
    #f8f8f8 20%,
    #f0f0f0 40%,
    #e8e8e8 60%,
    #e0e0e0 80%,
    #d8d8d8 100%
  );
  padding: 2rem;
`;

const ContentContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const TopBar = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #ff6b35;
  font-size: 1.2rem;
  font-weight: 600;
`;

const Nav = styled.nav`
  display: flex;
  gap: 2.5rem;
  justify-content: center;
`;

const NavLink = styled(Link)<{ $isActive?: boolean }>`
  text-decoration: none;
  color: ${props => props.$isActive ? '#333' : '#666'};
  font-size: 1.1rem;
  font-weight: ${props => props.$isActive ? '600' : '500'};
  padding: 0.5rem;
  
  &:hover {
    color: ${props => props.$isActive ? '#333' : '#666'};
  }
`;

const SignInButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  font-size: 0.9rem;
  justify-self: end;
  
  &:hover {
    color: #333;
  }
`;

const NavigationWrapper = () => {
  const location = useLocation();
  
  return (
    <Nav>
      <NavLink to="/" $isActive={location.pathname === '/'}>Tracker</NavLink>
      <NavLink to="/history" $isActive={location.pathname === '/history'}>History</NavLink>
    </Nav>
  );
};

function App() {
  const [completedDates, setCompletedDates] = useState<string[]>([]);
  const [exercises, setExercises] = useState<{ [key: string]: any }>(() => {
    const saved = localStorage.getItem('exercises');
    return saved ? JSON.parse(saved) : {};
  });

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('exercises', JSON.stringify(exercises));
    localStorage.setItem('completedDates', JSON.stringify(completedDates));
  }, [exercises, completedDates]);

  const handleExerciseAdded = (date: string, exerciseData: any) => {
    if (!completedDates.includes(date)) {
      setCompletedDates(prev => [...prev, date]);
    }
    
    setExercises(prev => {
      const dateExercises = prev[date] || [];
      const existingIndex = dateExercises.findIndex((ex: any) => ex.id === exerciseData.id);
      
      if (existingIndex >= 0) {
        // Update existing exercise
        const updatedExercises = [...dateExercises];
        updatedExercises[existingIndex] = exerciseData;
        return {
          ...prev,
          [date]: updatedExercises
        };
      } else {
        // Add new exercise
        return {
          ...prev,
          [date]: [...dateExercises, exerciseData]
        };
      }
    });
  };

  return (
    <Router>
      <AppContainer>
        <ContentContainer>
          <TopBar>
            <Title>Workout Tracker</Title>
            <NavigationWrapper />
          </TopBar>
          <Routes>
            <Route 
              path="/" 
              element={
                <Tracker 
                  onExerciseAdded={handleExerciseAdded}
                  savedExercises={exercises}
                />
              } 
            />
            <Route 
              path="/history" 
              element={
                <History 
                  completedDates={completedDates}
                />
              } 
            />
          </Routes>
        </ContentContainer>
      </AppContainer>
    </Router>
  );
}

export default App; 