import "./styles/CardLoading.css";

const CardLoading = () => {
  return (
    <div className="card-loader">
      <div className="loader-content">
        <div className="loader-top"></div>
        <div className="loader-title"></div>
        <div className="loader-description"></div>
        <div className="loader-bottom">
          <div className="loader-bottom-right"></div>
          <div className="loader-bottom-right"></div>
          <div className="loader-bottom-right"></div>
        </div>
      </div>
    </div>
  );
};
export default CardLoading;
