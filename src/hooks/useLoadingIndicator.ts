
import { useLoading } from "@/context/LoadingContext";
import { useEffect } from "react";

export function useLoadingIndicator(isLoading: boolean, delay: number = 0) {
  const { setIsLoading } = useLoading();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLoading) {
      if (delay > 0) {
        timer = setTimeout(() => {
          setIsLoading(true);
        }, delay);
      } else {
        setIsLoading(true);
      }
    } else {
      setIsLoading(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
      setIsLoading(false);
    };
  }, [isLoading, setIsLoading, delay]);
}
