import { create } from "zustand";
import { HeadLink } from "../components/header/headerLink";
import { UserRoles } from "../components/enums/userRoles";
import useChatStore from "./chatStore";

interface Session {
  loggedIn: boolean
  token: string | null
  headerLinks: HeadLink[]
  userId: string | null
  admin: boolean
  permissions: UserRoles[],
  displayName: string,
  devMode: boolean
}

const defaultLinks: HeadLink[] = [{ label: "Home", path: "/" }];
export class SessionImpl implements Session {
  constructor(
    public loggedIn: boolean = false,
    public token: string | null = null,
    public headerLinks: HeadLink[] = defaultLinks,
    public userId: string | null = "",
    public admin: boolean = false,
    public permissions: UserRoles[] = [],
    public displayName: string = "",
    public devMode: boolean = false
  ) { }
}

interface AuthStore {
  session: SessionImpl;
  login: (token: string | null, userId: string, permissions: UserRoles[], admin: boolean, displayName: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => {
  const devModeSession = (session: SessionImpl): SessionImpl => {
    return { ...session, headerLinks: [...session.headerLinks, { path: "/dev/panel", label: "Dev Panel" }] }
  }

  return {
    session: new SessionImpl(),
    login: (token: string | null, userId: string, permissions: UserRoles[], admin: boolean, displayName: string) => {
      set(() => {
        //console.log("permissions: ", permissions);
        const links = [...defaultLinks];
        if (permissions.includes(UserRoles.ROLE_RENTER)) {
          links.push({ label: "Add your Car", path: "/vehicle/new" });
          links.push({ label: "My Listings", path: "/admin/listings" });
        }
        if (permissions.includes(UserRoles.ADMIN)) {
          links.push({ label: "Users", path: "/admin/accounts" });
        }
        const devMode: boolean = Boolean(process.env.ADMIN_DEV_MODE);
        console.log(`dev mode: ${devMode ? "On" : "Off"}`);

        const session: SessionImpl = new SessionImpl(true, token, links, userId, admin, permissions, displayName, devMode);
        if (devMode) {
          return { session: devModeSession(session) };
        } else {
          return { session: session };
        }
      })
    },
    logout: () => {
      const { setConversations, setCurrentConversation } = useChatStore.getState();
      setCurrentConversation(null);
      setConversations([]);
      set(() => {
        return { session: new SessionImpl() }
      })
    }
  }
});

export default useAuthStore;