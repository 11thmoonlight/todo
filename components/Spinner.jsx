"use client";
import PacmanLoader from "react-spinners/MoonLoader";

const override = {
  display: "block",
  margin: "100px auto",
};

function Spinner() {
  return (
    <PacmanLoader
      color="#cca3ff"
      cssOverride={override}
      size={150}
      aria-label="Loading Spinner"
    />
  );
}

export default Spinner;
