import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const HOME_DIR = "/";

export function ErrorPage() {
  const [counter, setCounter] = useState(10);
  const interval = useRef();
  const homeNavigate = useNavigate();

  useEffect(() => {
    if (counter == 0) {
      clearInterval(interval.current);
      homeNavigate(HOME_DIR);
    }
  }, [counter]);

  useEffect(() => {
    interval.current = setInterval(() => setCounter((prev) => prev - 1), 1000);
    return () => {
      clearInterval(interval.current);
    };
  }, []);

  return (
    <>
      <h1>Something went wrong</h1>
      <p>You will be redirected in {counter}s</p>
      <p>
        or Back to <Link to={HOME_DIR}>Home</Link>
      </p>
    </>
  );
}
