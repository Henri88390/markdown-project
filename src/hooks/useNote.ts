import { useOutletContext } from "react-router-dom";
import { Note } from "../models";

export const useNote = () => {
  return useOutletContext<Note>();
};
