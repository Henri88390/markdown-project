import { Navigate, Route, Routes } from "react-router-dom";
import styles from "./App.module.scss";
import { NewNote } from "./components";

function App() {
  return (
    <div className={styles["container"]}>
      <Routes>
        <Route path="/" element={<div>Caca.</div>} />
        <Route path="/new" element={<NewNote />} />
        <Route path="/:id">
          <Route index element={<div>Show</div>} />
          <Route path="edit" element={<div>edit</div>} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
