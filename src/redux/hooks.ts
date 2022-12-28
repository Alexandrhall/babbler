import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { rootState, appDispatch } from "./store";

export const useAppDispatch = () => useDispatch<appDispatch>();
export const useAppSelector: TypedUseSelectorHook<rootState> = useSelector;
