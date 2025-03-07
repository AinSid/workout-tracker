import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format, startOfYear, addWeeks, startOfWeek, addDays } from 'date-fns';

const HistoryContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.25rem;
  min-height: calc(100vh - 10.5rem);

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    padding-top: 0.25rem;
    min-height: unset;
    height: 530px !important;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
`;

const WeekRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0.55rem 0;
  border-bottom: 1px solid #eee;
  font-size: 0.85rem;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 0;  // Increased vertical padding
  }
`;

const WeekNumber = styled.div`
  width: 25px;
  color: #666;
  font-size: 0.8rem;

  @media (max-width: 768px) {
    width: 65px;  // Wider to accommodate "Week" text
  }
`;

const DayBoxes = styled.div`
  display: flex;
  gap: 0.3rem;

  @media (max-width: 768px) {
    flex: 1;
    justify-content: space-between;
    padding-right: 0.5rem;
    gap: 0.6rem;  // Increased gap between day boxes
  }
`;

const DayBox = styled.div<{ isCompleted: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  cursor: pointer;
  background: ${props => props.isCompleted ? '#ff6b35' : '#f5f5f5'};
  color: ${props => props.isCompleted ? 'white' : '#666'};
  transition: all 0.2s;

  &:hover {
    background: ${props => props.isCompleted ? '#ff6b35' : '#eee'};
  }
`;

const Title = styled.h1`
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 1.5rem;
  grid-column: 1 / -1;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

interface CompletedWorkout {
  [key: string]: boolean;
}

interface HistoryProps {
  completedDates?: string[];
}

const History: React.FC<HistoryProps> = ({ completedDates = [] }) => {
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout>(() => {
    // Load saved state from localStorage
    const saved = localStorage.getItem('historyCompletedWorkouts');
    const savedData = saved ? JSON.parse(saved) : {};
    
    // Merge saved data with completedDates from props
    return {
      ...savedData,
      ...completedDates.reduce((acc, date) => ({ ...acc, [date]: true }), {})
    };
  });
  
  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('historyCompletedWorkouts', JSON.stringify(completedWorkouts));
  }, [completedWorkouts]);

  // Update state when new completedDates come in from props
  useEffect(() => {
    setCompletedWorkouts(prev => ({
      ...prev,
      ...completedDates.reduce((acc, date) => ({ ...acc, [date]: true }), {})
    }));
  }, [completedDates]);

  const today = new Date();
  const yearStart = startOfYear(today);
  
  const weeks = Array.from({ length: 52 }, (_, i) => {
    const weekStart = startOfWeek(addWeeks(yearStart, i), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, j) => addDays(weekStart, j));
  });

  const toggleDay = (dateStr: string) => {
    setCompletedWorkouts(prev => ({
      ...prev,
      [dateStr]: !prev[dateStr]
    }));
  };

  const isMobile = window.innerWidth <= 768;
  
  const weekChunks = [
    weeks.slice(0, 13),
    weeks.slice(13, 26),
    weeks.slice(26, 39),
    weeks.slice(39)
  ];

  return (
    <HistoryContainer>
      <Title>Workout History{!isMobile && " (weeks)"}</Title>
      {isMobile ? (
        // Mobile view - single column with "Week X"
        weeks.map((week, i) => (
          <WeekRow key={i}>
            <WeekNumber>Week {i + 1}</WeekNumber>
            <DayBoxes>
              {week.map(day => {
                const dateStr = format(day, 'yyyy-MM-dd');
                return (
                  <DayBox
                    key={dateStr}
                    isCompleted={completedWorkouts[dateStr]}
                    onClick={() => toggleDay(dateStr)}
                  >
                    {format(day, 'E')[0]}
                  </DayBox>
                );
              })}
            </DayBoxes>
          </WeekRow>
        ))
      ) : (
        // Desktop view - 4 columns with numbers only
        weekChunks.map((chunk, columnIndex) => (
          <div key={columnIndex}>
            {chunk.map((week, i) => (
              <WeekRow key={i}>
                <WeekNumber>{i + 1 + columnIndex * 13}</WeekNumber>
                <DayBoxes>
                  {week.map(day => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    return (
                      <DayBox
                        key={dateStr}
                        isCompleted={completedWorkouts[dateStr]}
                        onClick={() => toggleDay(dateStr)}
                      >
                        {format(day, 'E')[0]}
                      </DayBox>
                    );
                  })}
                </DayBoxes>
              </WeekRow>
            ))}
          </div>
        ))
      )}
    </HistoryContainer>
  );
};

export default History; 
