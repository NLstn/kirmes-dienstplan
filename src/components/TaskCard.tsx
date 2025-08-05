import React from 'react';
import type { GroupedTask } from '../types';

interface TaskCardProps {
  task: GroupedTask;
  onPersonClick?: (personName: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onPersonClick }) => {
  return (
    <div className="task-card">
      <div style={{
        borderBottom: '2px solid var(--secondary-black)',
        paddingBottom: '10px',
        marginBottom: '10px'
      }}>
        <div className="task-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ 
              color: 'var(--secondary-black)', 
              fontSize: '1.3rem',
              margin: '0 0 8px 0',
              fontWeight: 'bold'
            }}>
              {task.task}
            </h3>
            <p style={{ 
              color: 'var(--text-color)', 
              fontSize: '1rem',
              margin: 0,
              fontWeight: '500'
            }}>
            </p>
          </div>
          
          <div className="task-date-time">
            <div style={{ 
              color: 'var(--secondary-black)', 
              fontSize: '1.1rem',
              fontWeight: 'bold',
              marginBottom: '4px'
            }}>
              {task.date}
            </div>
            <div style={{ 
              color: 'var(--text-color)', 
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              🕐 {task.time}
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h4 style={{ 
          color: 'var(--secondary-black)', 
          fontSize: '1.1rem',
          marginBottom: '12px',
          fontWeight: 'bold'
        }}>
          👥 Zugewiesene Personen ({task.persons.length}):
        </h4>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {task.persons.length > 0 ? (
            task.persons.map((person, personIndex) => (
              <span
                key={personIndex}
                onClick={() => onPersonClick?.(person)}
                style={{
                  background: 'var(--secondary-black)',
                  color: 'var(--primary-yellow)',
                  border: '2px solid var(--secondary-black)',
                  borderRadius: '20px',
                  padding: '6px 15px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: onPersonClick ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => {
                  if (onPersonClick) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (onPersonClick) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
                title={onPersonClick ? `Nach ${person} filtern` : undefined}
              >
                {person}
              </span>
            ))
          ) : (
            <span style={{
              background: 'var(--red)',
              color: 'var(--white)',
              border: '2px solid var(--red)',
              borderRadius: '20px',
              padding: '6px 15px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              ⚠️ Nicht zugewiesen
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
