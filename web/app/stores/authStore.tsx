import { create } from "zustand";
import { HeadLink } from "../components/header/headerLink";

interface Session {
  loggedIn: boolean
  token: string | null
  headerLinks: HeadLink[]
  userId: string | null;
}

const defaultLinks: HeadLink[] = [
  { label: "Home", path: "/" },
  { label: "Add your Car", path: "/vehicle/new" }
];

const loggedInLinks: HeadLink[] = [...defaultLinks, { label: "My Listings", path: "/admin/listings" }]

export class SessionImpl implements Session {
  loggedIn: boolean;
  token: string | null;
  headerLinks: HeadLink[];
  userId: string | null;

  constructor() {
    this.loggedIn = false;
    this.token = null;
    this.headerLinks = defaultLinks;
    this.userId = "";
  }

  public isLoggedIn = (): boolean => {
    return this.loggedIn;
  }

  public setLoggedIn = (loggedIn: boolean): void => {
    this.loggedIn = loggedIn
  }

  public getToken = (): string | null => {
    return this.token;
  }

  public setToken = (token: string | null): void => {
    this.token = token;
  }

  public getHeaderLinks = (): HeadLink[] => {
    return this.headerLinks;
  }

  public setHeaderLinks = (headerLinks: HeadLink[]): void => {
    this.headerLinks = headerLinks;
  }

  public getUserId = (): string | null => {
    return this.userId;
  }

  public setUserId = (userId: string | null): void => {
    this.userId = userId;
  }

}

interface AuthStore {
  session: SessionImpl;
  login: (token: string | null, userId: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  session: new SessionImpl(),
  login: (token: string | null, userId: string) => {
    set(() => {
      const newSession = new SessionImpl();
      newSession.setLoggedIn(true);
      newSession.setHeaderLinks(loggedInLinks);
      newSession.setToken(token);
      newSession.setUserId(userId);
      return { session: newSession }
    })
  },
  logout: () => {
    set(() => {
      return { session: new SessionImpl() }
    })
  }
}));

export default useAuthStore;