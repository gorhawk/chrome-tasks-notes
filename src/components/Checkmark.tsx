import React from "react";

interface CheckmarkProps {
  visible: boolean;
}

const Checkmark = ({ visible }: CheckmarkProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fillRule="evenodd"
    clipRule="evenodd"
    className={`pointer-events-none absolute block size-6 ${visible ? "visible" : "invisible"}`}
  >
    <path
      d="M21 6.285l-11.16 12.733-6.84-6.018 1.319-1.49 5.341 4.686 9.865-11.196 1.475 1.285z"
      fill="rgb(140, 140, 140)"
    />
  </svg>
);

export default Checkmark;
