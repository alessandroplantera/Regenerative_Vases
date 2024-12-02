"use client";

import React from "react";

const Loader = ({ progress }) => {
  return (
    <div className="loader">
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      <p>{Math.round(progress)}%</p>
    </div>
  );
};

export default Loader;
