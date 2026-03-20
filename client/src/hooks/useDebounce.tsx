import { useEffect, useState } from "react";

const useDebounce = (value: string) => {
  const [dQuery, setDQuery] = useState("");
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDQuery(value);
    }, 2000);

    return () => clearTimeout(timerId);
  }, [value]);

  return dQuery;
};

export default useDebounce;
