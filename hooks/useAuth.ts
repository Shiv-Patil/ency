import { useEffect, useState } from "react";
import firebase from "firebase/app";
import { db, auth, googleAuthProvider } from "config/firebase";
import {
  IUser,
  SignInFunction,
  SignInWithGoogle,
  SignOutFunction,
  SignUpFunction,
  UseAuth,
} from "types/common.types";
import { SignInFormInputs, SignUpFormInputs } from "types/forms.types";

export const useAuthProvider = (): UseAuth => {
  const [user, setUser] = useState<IUser>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((newUser) => {
      if (newUser) {
        const isVerified: boolean = newUser.emailVerified;
        console.log(isVerified);
        setUser({ email: newUser.email || undefined, uid: newUser.uid, isVerified: isVerified });
        getUserAdditionalData(newUser);
      }
      setIsLoading(false);
    });
  }, []);

  const createUser = (user: IUser): Promise<IUser | { error: Error }> => {
    return db
      .collection("users")
      .doc(user.uid)
      .set(user)
      .then(() => {
        return user;
      })
      .catch((error) => {
        return { error };
      });
  };

  const signInWithGoogle: SignInWithGoogle = () => {
    return auth
      .signInWithPopup(googleAuthProvider)
      .then((res) => {
        if (!res.user) throw new Error("Something went wrong");
        const { uid, displayName, email } = res.user;
        return createUser({ uid, name: displayName || undefined, email: email || undefined });
      })
      .catch((error) => {
        return { error };
      });
  };

  const signUp: SignUpFunction = ({ email, password, name }: SignUpFormInputs) => {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        auth.currentUser?.sendEmailVerification();
        return createUser({ email, uid: res.user?.uid, name });
      })
      .catch((error) => {
        return { error };
      });
  };

  const signIn: SignInFunction = ({ email, password }: SignInFormInputs) => {
    return auth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        if (!res.user) throw Error("Something went wrong");
        const { email, uid } = res.user;
        setUser({ email: email || undefined, uid, isVerified: res.user.emailVerified });
        getUserAdditionalData(res.user);
        return res.user;
      })
      .catch((error) => {
        return { error };
      });
  };

  const signOut: SignOutFunction = () => {
    return auth.signOut().then(() => setUser({}));
  };

  const getUserAdditionalData = (user: firebase.User): void => {
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((userData) => {
        if (userData.data()) {
          setUser({ ...(userData.data() as IUser), isVerified: user.emailVerified });
        }
      });
  };

  return {
    user,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    isLoading,
  };
};
