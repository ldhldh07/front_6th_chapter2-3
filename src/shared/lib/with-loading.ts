export function wrapWithLoading<TArgs extends unknown[], TResult>(
  setIsLoading: (v: boolean) => void,
  fn: (...args: TArgs) => Promise<TResult>,
) {
  return async (...args: TArgs): Promise<TResult> => {
    setIsLoading(true);
    try {
      return await fn(...args);
    } finally {
      setIsLoading(false);
    }
  };
}
