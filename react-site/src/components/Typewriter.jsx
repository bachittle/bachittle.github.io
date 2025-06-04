import { useState, useEffect } from 'react';

export default function Typewriter({ text = '', texts = [], eraseText = true }) {
  const [display, setDisplay] = useState('');
  const [index, setIndex] = useState(0);
  const [caret, setCaret] = useState(true);

  const currentText = texts.length ? texts[index] : text;

  useEffect(() => {
    let timeout;
    if (display.length < currentText.length) {
      timeout = setTimeout(() => {
        setDisplay(currentText.slice(0, display.length + 1));
      }, 80);
    } else if (eraseText) {
      timeout = setTimeout(() => {
        setDisplay('');
        if (texts.length) {
          setIndex((index + 1) % texts.length);
        }
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [display, currentText]);

  useEffect(() => {
    const id = setInterval(() => setCaret(c => !c), 400);
    return () => clearInterval(id);
  }, []);

  return (
    <span>{display}{caret ? '|' : ' '}</span>
  );
}
