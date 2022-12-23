import { atom } from "jotai";
import { TwitterApiClient } from "../../shared/TwitterApiClient";

export const followingAtom = atom<Awaited<ReturnType<TwitterApiClient['getFollowing']>>['data']>(undefined);
