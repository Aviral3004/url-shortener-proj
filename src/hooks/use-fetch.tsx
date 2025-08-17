import { useState } from "react";

type AsyncFunction<TData, TOptions, TArgs extends any[]> = (
  options: TOptions,
  ...args: TArgs
) => Promise<TData>;

type UseFetchReturn<TData, TArgs extends any[]> = {
  data: TData | null;
  loading: boolean | null;
  error: Error | null;
  fn: (...args: TArgs) => Promise<void>;
};

function useFetch<TData = unknown, TOptions = {}, TArgs extends any[] = []>(
  cb: AsyncFunction<TData, TOptions, TArgs>,
  options?: TOptions
): UseFetchReturn<TData, TArgs> {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fn = async (...args: TArgs): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await cb(options as TOptions, ...args);
      setData(response);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
}

export default useFetch;
