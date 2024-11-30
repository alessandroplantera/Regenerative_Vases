const Loader = ({ progress }) => {
  return (
    <div className="loader">
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      <p>{progress}%</p>
    </div>
  );
};

export default Loader;
