import { db } from "./Firebase";
import {
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";

export const updateAlertConfig = async (
    uid,
    field,
    value
  ) => {
  
    try {
  
      const userRef = doc(db, "users", uid);
  
      await updateDoc(userRef, {
        [field]: value
      });
  
    } catch (error) {
  
      console.log(error);
  
      throw error;
  
    }
  
  };
  
  // UPDATE QUIET HOURS
  export const updateQuietHours = async (
    uid,
    startTime,
    endTime
  ) => {
  
    try {
  
      const userRef = doc(db, "users", uid);
  
      await updateDoc(userRef, {

        quietHoursStartTime:
          startTime === "None"
            ? null
            : startTime,
      
        quietHoursEndTime:
          endTime === "None"
            ? null
            : endTime
      
      });
  
    } catch (error) {
  
      console.log(error);
  
      throw error;
  
    }
  
  };

// GET CURRENT USER DATA
export const getCurrentUserData = async (uid) => {

  try {

    const userRef = doc(db, "users", uid);

    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    return userSnap.data();

  } catch (error) {

    console.log(error);

    throw error;

  }

};

// GET HOME MEMBERS
export const getHomeMembers = async (
  homeID
) => {

  try {

    // GET HOME
    const homeRef = doc(db, "homes", homeID);

    const homeSnap = await getDoc(homeRef);

    if (!homeSnap.exists()) {
      return [];
    }

    const homeData = homeSnap.data();
    const members = [];


    // FETCH HOST
    const hostUID = homeData.homeAdminID;
    const hostRef = doc(db, "users", hostUID);
    const hostSnap = await getDoc(hostRef);

    if (hostSnap.exists()) {

      const hostData = hostSnap.data();

      members.push({

        uid: hostUID,

        username: hostData.username,

        role: "HOST"

      });

    }

    // FETCH MEMBERS
    const memberIDs = homeData.memberIDs || [];

    for (const uid of memberIDs) {

      if (uid === hostUID) continue;

      const userRef = doc(db, "users", uid);

      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {

        const userData = userSnap.data();

        members.push({

          uid: uid,

          username: userData.username,

          role: "MEMBER"

        });

      }

    }

    return members;

  } catch (error) {

    console.log(error);

    throw error;

  }

};
