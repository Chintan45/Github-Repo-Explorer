
const UserSearchBox = ({userName, onChange, onSearchClick}) => {
  return (
    <div className="d-flex align-items-center bg-light px-3 py-2 small rounded-3">
      <label className="me-2 fw-bold text-secondary">
        Username:
      </label>
      <div className="input-group">
        <input
          id="username"
          className="form-control form-control-sm"
          type="text"
          placeholder="Search user by username"
          value={userName}
          style={{ maxWidth: '50%'}}
          onChange={(e) => onChange(e.target.value)}
        />
        <button type="button" className="btn btn-outline-secondary" onClick={onSearchClick}>
          <i className="bi bi-search"></i>
        </button>
      </div>
    </div>
  );
};

export default UserSearchBox;