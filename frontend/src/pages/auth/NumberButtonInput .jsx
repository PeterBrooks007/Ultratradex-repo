import { useState } from 'react';
import { styled } from '@mui/material/styles';

const NumberButtonsWrapper = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gridGap: '10px',
  width: '300px',
  margin: '0 auto',
  textAlign: 'center',
});

const StyledButton = styled('button')({
  backgroundColor: '#f2f2f2',
  border: 'none',
  color: '#333',
  fontSize: '24px',
  padding: '15px',
  borderRadius: '5px',
  cursor: 'pointer',
  boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: '#ddd',
  },
  '&:active': {
    boxShadow: 'none',
    transform: 'translateY(2px)',
  },
});

const NumberButtonInput = () => {
  const [inputValue, setInputValue] = useState('');

  const updateInput = (num) => {
    setInputValue((prev) => prev + num.toString());
  };

  const clearInput = () => {
    setInputValue('');
  };

  const submitForm = () => {
    alert(`Submitted value: ${inputValue}`);
    clearInput();
  };

  return (
    <div>
      <NumberButtonsWrapper>
        {[...Array(10).keys()].map((i) => (
          <StyledButton key={i} type="button" onClick={() => updateInput(i)}>
            {i}
          </StyledButton>
        ))}
        <StyledButton type="submit" onClick={submitForm} name="submit">
          OK
        </StyledButton>
        <StyledButton type="button" onClick={clearInput}>
          Delete
        </StyledButton>
      </NumberButtonsWrapper>
    </div>
  );
};

export default NumberButtonInput;
