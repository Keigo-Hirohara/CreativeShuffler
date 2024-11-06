import { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.scss';

type Props = {
  word: string;
  isLoading: boolean;
  key: string; // キーを追加
  onChangeWordValue: (e: ChangeEvent<HTMLTextAreaElement>) => void;
};

export const Card = ({
  word,
  isLoading,
  key,
  onChangeWordValue,
}: Props): JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsVisible(false);
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, [key]);

  const handleCardClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="relative h-80 w-60" onClick={handleCardClick}>
      <div
        key={key}
        className={`
          border border-slate-400 rounded-xl w-full h-full
          flex items-center justify-center p-8 shadow-2xl
          transition-all duration-500 ease-out
          ${
            isVisible
              ? 'translate-y-0 opacity-100'
              : '-translate-y-full opacity-0'
          }
        `}
      >
        {isLoading ? (
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <textarea
            ref={textareaRef}
            value={word}
            onChange={onChangeWordValue}
            className="auto-size"
          />
          // <p>{word}</p>
        )}
      </div>
    </div>
  );
};
