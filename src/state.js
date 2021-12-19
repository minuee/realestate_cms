import { atom } from "recoil";
export const loading = atom({
  key: "isLoading",
  default: false,
});

export const authState = atom({
  key: "authState",
  default: "SIGNED",
  // default: "NOT_SIGN",
});
