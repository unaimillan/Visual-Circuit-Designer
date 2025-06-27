
import { useState, useRef} from "react";



const SpamProtectedButton = () => {
  const [pressed, setPressed] = useState(false);
  const timeoutRef = useRef(null);
  const delay = 500; // миллисекунд между нажатием и отпусканием

  const handlePress = () => {
    if (pressed || timeoutRef.current) return; // блокируем повторное нажатие

    setPressed(true);

    // Автоматическое отпускание через задержку
    timeoutRef.current = setTimeout(() => {
      if(!pressed){
        setPressed(false);
        timeoutRef.current = null;
      }
    }, delay);
  };

  return (
    <button
      onClick={handlePress}
      disabled={pressed} // не обязательно, но можно
      style={{
        backgroundColor: pressed ? '#aaa' : '#007bff',
        color: 'white',
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: pressed ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.2s ease',
      }}
    >
      {pressed ? 'Нажато...' : 'Нажми меня'}
    </button>
  );
};




export default SpamProtectedButton;



