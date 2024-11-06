import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { Category } from '@/types/Category';

interface WikipediaResponse {
  query: {
    random?: Array<{ title: string }>;
    categorymembers?: Array<{ title: Category }>;
  };
}

export const useRandomWord = (initialLimit: number = 5) => {
  const [words, setWords] = useState<string[]>([]);
  const [wordsMap, setWordsMap] = useState<Map<string, string[]>>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const initialFetchDone = useRef(false);

  const fetchRandomWords = useCallback(
    async (categories?: Category[], limit: number = initialLimit) => {
      setIsLoading(true);
      setError(null);

      try {
        // let allWords: string[] = [];

        if (!categories || categories.length === 0) {
          // カテゴリが指定されていない場合、ランダムな記事を取得
          const response = await axios.get<WikipediaResponse>(
            'https://ja.wikipedia.org/w/api.php',
            {
              params: {
                action: 'query',
                format: 'json',
                list: 'random',
                rnlimit: limit,
                rnnamespace: '0',
                origin: '*',
              },
            }
          );
          wordsMap.set(
            'random',
            response.data.query.random?.map((item) => item.title) || []
          );
          setWordsMap(new Map(wordsMap));
          // allWords =
          //   response.data.query.random?.map((item) => item.title) || [];
        } else {
          // 指定されたカテゴリから記事を取得
          // for (const category of categories) {
          //   if (wordsMap.has(category)) {
          //     continue;
          //   }
          //   const response = await axios.get<WikipediaResponse>(
          //     'https://ja.wikipedia.org/w/api.php',
          //     {
          //       params: {
          //         action: 'query',
          //         format: 'json',
          //         list: 'categorymembers',
          //         cmtitle: `Category:${category}`,
          //         cmlimit: '500',
          //         origin: '*',
          //       },
          //     }
          //   );
          //   // console.log(response);
          //   const categoryWords =
          //     response.data.query.categorymembers?.flatMap((item) => {
          //       if (item.title.startsWith('Category:')) {
          //         return [item.title.replace('Category:', '')];
          //       }
          //       if (item.title == category) return [];
          //       return [item.title];
          //     }) || [];
          //   wordsMap.set(category, categoryWords);
          //   setWordsMap(new Map(wordsMap));
          //   // allWords = [...allWords, ...categoryWords];
          // }
          try {
            const requests = categories.flatMap((category) => {
              if (wordsMap.has(category)) {
                return [];
              }
              return axios.get<WikipediaResponse>(
                'https://ja.wikipedia.org/w/api.php',
                {
                  params: {
                    action: 'query',
                    format: 'json',
                    list: 'categorymembers',
                    cmtitle: `Category:${category}`,
                    cmlimit: '500',
                    origin: '*',
                  },
                }
              );
            });

            const responses = await Promise.all(requests);

            responses.forEach((response, index) => {
              const category = categories[index];
              const categoryWords =
                response.data.query.categorymembers?.flatMap((item) => {
                  if (item.title.startsWith('Category:')) {
                    return [item.title.replace('Category:', '')];
                  }
                  if (item.title == category) return [];
                  return [item.title];
                }) || [];
              wordsMap.set(category, categoryWords);
            });

            setWordsMap(new Map(wordsMap));
          } catch (err) {
            console.error(err);
            throw new Error('カテゴリの取得に失敗しました');
          }
        }
        // 重複を削除し、ランダムにシャッフル
        const uniqueWords = getUniqueWordsFromMap(wordsMap);
        const shuffled = uniqueWords.sort(() => 0.5 - Math.random());

        // 指定された数だけ選択
        setWords(shuffled.slice(0, limit));
      } catch (err) {
        setError(
          'エラーが発生しました: ' +
            (err instanceof Error ? err.message : String(err))
        );
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    },
    [initialLimit, wordsMap]
  );

  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchRandomWords();
      initialFetchDone.current = true;
    }
  }, [fetchRandomWords]);

  // useEffect(() => {
  //   console.log('無限！');
  //   fetchRandomWords();
  // }, [fetchRandomWords]);

  return { words, isLoading, error, fetchRandomWords };
};

const getUniqueWordsFromMap = (map: Map<string, string[]>): string[] => {
  // Set を使用して重複を排除しながら値を収集
  const uniqueValuesSet = new Set<string>();

  // Map の全ての値を走査
  for (const values of map.values()) {
    // 各配列の要素を Set に追加
    values.forEach((value) => uniqueValuesSet.add(value));
  }

  // Set を配列に変換して返す
  return Array.from(uniqueValuesSet);
};
