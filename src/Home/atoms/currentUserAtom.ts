import { atom } from "jotai";
import { TwitterApiClient } from "../../shared/TwitterApiClient";

export const currentUserAtom = atom<Awaited<ReturnType<TwitterApiClient['getCurrentUser']>>['data']>(undefined);
