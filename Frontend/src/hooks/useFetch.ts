import { useEffect, useState } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(fetcher: () => Promise<T>) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setState({ data: null, loading: true, error: null });
      try {
        const data = await fetcher();
        if (isMounted) setState({ data, loading: false, error: null });
      } catch (err: any) {
        if (isMounted)
          setState({
            data: null,
            loading: false,
            error: err.message || "Error",
          });
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [fetcher]);

  return state;
}
