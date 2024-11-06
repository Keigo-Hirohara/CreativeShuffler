'use client';

import { Card } from '@/components/Card/Card';
import { FixButton } from '@/components/FixButton/FixButton';
import { useRandomWord } from '@/hooks/useRandomWord';
import { allCategories } from '@/types/Category';
import { useCallback, useEffect, useState } from 'react';

type CardState = {
  word: string;
  isFixed: boolean;
  key: string; // キーを追加
};

export default function Home() {
  const { words, isLoading, fetchRandomWords } = useRandomWord();
  const [leftCard, setLeftCard] = useState<CardState>({
    word: words[0],
    isFixed: false,
    key: 'left-' + Date.now(), // ユニークなキーを生成
  });
  const [rightCard, setRightCard] = useState<CardState>({
    word: words[1],
    isFixed: false,
    key: 'right-' + Date.now(), // ユニークなキーを生成
  });

  const reGenerateWord = useCallback(() => {
    if (leftCard.isFixed && rightCard.isFixed) {
      return;
    }
    fetchRandomWords(allCategories);
  }, [leftCard.isFixed, rightCard.isFixed, fetchRandomWords]);

  useEffect(() => {
    if (!leftCard.isFixed)
      setLeftCard({
        word: words[0],
        isFixed: false,
        key: 'left-' + Date.now(),
      });
    if (!rightCard.isFixed)
      setRightCard({
        word: words[1],
        isFixed: false,
        key: 'right-' + Date.now(),
      });
  }, [words]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-around px-20 py-20 w-4/5">
        <div className="flex flex-col items-center gap-y-6">
          <Card
            word={leftCard.word}
            isLoading={isLoading && !leftCard.isFixed}
            key={leftCard.key}
            onChangeWordValue={(e) => {
              setLeftCard({
                word: e.target.value,
                isFixed: true,
                key: leftCard.key,
              });
            }}
          />
          <FixButton
            isChecked={leftCard.isFixed}
            onClick={(isChecked) => {
              setLeftCard({ ...leftCard, isFixed: isChecked });
            }}
          />
        </div>

        <div className="flex flex-col items-center gap-y-6">
          <Card
            word={rightCard.word}
            isLoading={isLoading && !rightCard.isFixed}
            key={rightCard.key}
            onChangeWordValue={(e) => {
              setRightCard({
                word: e.target.value,
                isFixed: true,
                key: rightCard.key,
              });
            }}
          />
          <FixButton
            isChecked={rightCard.isFixed}
            onClick={(isChecked) => {
              setRightCard({ ...rightCard, isFixed: isChecked });
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center" aria-label="読み込み中">
          <div className="animate-ping h-2 w-2 bg-blue-600 rounded-full"></div>
          <div className="animate-ping h-2 w-2 bg-blue-600 rounded-full mx-4"></div>
          <div className="animate-ping h-2 w-2 bg-blue-600 rounded-full"></div>
        </div>
      ) : (
        <button
          onClick={() => {
            reGenerateWord();
          }}
          disabled={isLoading || (leftCard.isFixed && rightCard.isFixed)}
          className="bg-[#1D5D9B] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-40 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <span>
            {isLoading || (leftCard.isFixed && rightCard.isFixed)
              ? 'カードが両方固定されています'
              : '再生成'}
          </span>
        </button>
      )}
    </div>
  );
}
