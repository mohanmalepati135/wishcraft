import './Loader.css';

const Loader = () => (
  <div className="loader">
    <div className="loader__ring"><div></div><div></div><div></div><div></div></div>
    <span className="loader__text">Loading...</span>
  </div>
);

export default Loader;
