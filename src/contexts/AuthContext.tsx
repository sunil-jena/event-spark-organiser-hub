/* eslint-disable react-refresh/only-export-components */
import { AuthModel } from '@/modules/auth/core/types';
import {
  FC,
  useState,
  useEffect,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useCallback,
  PropsWithChildren,
} from 'react';
import * as authHelper from '@/modules/auth/core/AuthHelpers';
import { getUserByToken } from '@/modules/auth/core/_request';

type AuthContextProps = {
  auth: AuthModel | undefined;
  saveAuth: (auth: AuthModel | undefined) => void;
  currentUser: unknown | undefined;
  setCurrentUser: Dispatch<SetStateAction<unknown | undefined>>;
  logout: () => void;
};

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => {},
  currentUser: undefined,
  setCurrentUser: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState);

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState<unknown | undefined>();
  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth);
    } else {
      authHelper.removeAuth();
    }
  };

  const logout = () => {
    saveAuth(undefined);
    setCurrentUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{ auth, saveAuth, currentUser, setCurrentUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const AuthInit: FC<PropsWithChildren> = ({ children }) => {
  const { auth, currentUser, logout, setCurrentUser, saveAuth } = useAuth();
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  // Memoize functions using useCallback
  const memoizedLogout = useCallback(logout, [logout]);
  const memoizedSetCurrentUser = useCallback(setCurrentUser, [setCurrentUser]);
  const memoizedSetShowSplashScreen = useCallback(setShowSplashScreen, [
    setShowSplashScreen,
  ]);
  const memoizedSaveAuth = useCallback(saveAuth, [saveAuth]);

  useEffect(() => {
    let isRequestCancelled = false;

    const requestUser = async (apiToken: string) => {
      try {
        const timeoutId = setTimeout(() => {
          if (!isRequestCancelled) {
            memoizedSaveAuth(undefined);
            memoizedSetCurrentUser(undefined);
            memoizedSetShowSplashScreen(false);
          }
        }, 3000); // Set timeout for 3 seconds

        const response = (await getUserByToken(apiToken)) as any;
        clearTimeout(timeoutId); // Clear timeout if the request finishes in time

        if (!isRequestCancelled && response?.data) {
          memoizedSetCurrentUser(response?.data);
        }
      } catch (error) {
        if (!isRequestCancelled && currentUser) {
          memoizedLogout();
        }
      } finally {
        if (!isRequestCancelled) {
          memoizedSetShowSplashScreen(false);
        }
      }
    };

    if (auth && auth.data) {
      requestUser(auth.data.token);
    } else {
      memoizedLogout();
      memoizedSetShowSplashScreen(false);
    }

    return () => {
      isRequestCancelled = true; // Handle component unmounting while the request is still pending
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoizedSetCurrentUser, memoizedSetShowSplashScreen]);

  return showSplashScreen ? <>Loding....</> : <>{children}</>;
};

export { AuthProvider, AuthInit, useAuth };
