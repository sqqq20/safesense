import { auth } from "./Firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const db = getFirestore();

export const loginUser = async (
  email,
  password
) => {

  try {

    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    return {
      success: true,
      user: userCredential.user
    };

  } catch (error) {

    let message = "Login failed.";

    if (
      error.code ===
      "auth/invalid-credential"
    ) {

      message =
        "Incorrect email or password.";

    }

    return {
      success: false,
      error: message
    };

  }

};

export const logoutUser = async () => {

  try {

    await signOut(auth);

    return {
      success: true
    };

  } catch (error) {

    return {
      success: false,
      error: error.message
    };

  }

};

export const registerUser = async (email, password, username, contact) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      email: email,
      username: username,
      contactNumber: "+60" + contact,

      homeID: "",
      role: "member",            
      profilePhoto: "",      
      emergencyAlertEnabled: true,
      minimumRiskLevel:"medium",
      notifyByPush: true,
      notifyByEmail: false,
      notifyBySMS:false,
      quietHoursStartTime: "",
      quiteHoursEndTime: "",
      isActive: true,
      alertEnabled: true,
      createdAt: serverTimestamp(),

      // Future use
      lastLogin: null
    });

    return user;
  } catch (error) {
    throw error.message;
  }
};

// RESET PASSWORD
export const resetPassword = async (
  email
) => {

  try {

    await sendPasswordResetEmail(
      auth,
      email
    );

    return {
      success: true
    };

  } catch (error) {

    let message =
      "Failed to send reset email.";

    if (
      error.code ===
      "auth/user-not-found"
    ) {

      message =
        "No account found with this email.";

    }
    else if (
      error.code ===
      "auth/invalid-email"
    ) {

      message =
        "Invalid email format.";

    }

    return {
      success: false,
      error: message
    };

  }

};
