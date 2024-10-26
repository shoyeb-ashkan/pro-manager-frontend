import Loading from "./Loading";
import "./styles/Logout.css";

const Logout = ({ loading = false, handleSubmit, type, setShow }) => {
  return (
    <div className="logout__container">
      <div className="logout__content">
        <button
          className="logout__button"
          onClick={() => handleSubmit()}
          disabled={loading}
        >
          {loading ? <Loading /> : `Yes, ${type}`}
        </button>
        <button className="cancle__logout" onClick={() => setShow(false)}>
          {" "}
          Cancle
        </button>
      </div>
    </div>
  );
};
export default Logout;
