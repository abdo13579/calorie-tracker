import { Link, useParams } from "react-router-dom"

export function Detailes() {
  const params = useParams()
  return (
    <>
      <p>page id is: {params.idrecord}</p>
      <Link to=".." relative="path">Back</Link>
    </>
  );
}
