import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <>
      <p>welcome to calorie tracker</p>
      <p><Link to="tracker">get started</Link></p>
    </>
  );
}
