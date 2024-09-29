import { create } from "zustand";
import { HeadLink } from "../components/header/headerLink";

interface Session {
  loggedIn: boolean
  token: string | null
  headerLinks: HeadLink[]
  userId: string | null;
  admin: boolean
}

const defaultLinks: HeadLink[] = [
  { label: "Home", path: "/" },
  { label: "Add your Car", path: "/vehicle/new" }
];

const loggedInLinks: HeadLink[] = [...defaultLinks, { label: "My Listings", path: "/admin/listings" }]

const adminLinks: HeadLink[] = [...loggedInLinks, { label: "Users", path: "/admin/accounts" }]

export class SessionImpl implements Session {
  constructor(
    public loggedIn: boolean = false,
    public token: string | null = null,
    public headerLinks: HeadLink[] = defaultLinks,
    public userId: string | null = "",
    public admin: boolean = false
  ) { }
}

interface AuthStore {
  session: SessionImpl;
  login: (token: string | null, userId: string, admin: boolean) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  session: new SessionImpl(),
  login: (token: string | null, userId: string, admin: boolean) => {
    set(() => {
      const newLinks = admin ? adminLinks : loggedInLinks;
      const newSession = new SessionImpl(true, token, newLinks, userId, admin);
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