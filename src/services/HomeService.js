import { auth, db } from "./Firebase";
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    Timestamp,
    query,
    where,
    getDocs,
    arrayUnion,
    arrayRemove
  } from "firebase/firestore";


// CREATE HOME
// =====================================
export const createHome = async () => {

  try {

    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("No authenticated user");
    }


    // CREATE HOME DOCUMENT
    const homeRef = await addDoc(
      collection(db, "homes"),
      {

        homeAdminID: currentUser.uid,

        memberIDs: [],

        createdAt: Timestamp.now(),

        homeName: null

      }
    );

    // UPDATE USER DOCUMENT
    const userRef = doc(
      db,
      "users",
      currentUser.uid
    );

    await updateDoc(userRef, {

      homeID: homeRef.id,

      role: "host"

    });



    return homeRef.id;

  } catch (error) {

    console.log(error);

    throw error;

  }

};

// ADD MEMBER BY EMAIL
export const addMemberByEmail = async (
    homeID,
    email
  ) => {
  
    try {
  
      // FIND USER
      const q = query(
        collection(db, "users"),
        where("email", "==", email)
      );
  
      const querySnapshot = await getDocs(q);
  
      // USER NOT FOUND
      if (querySnapshot.empty) {
  
        return {
          success: false,
          message: "User not found"
        };
  
      }
  
      // GET USER
      const userDoc = querySnapshot.docs[0];
      const userID = userDoc.id;
      const userData = userDoc.data();
  
      // ALREADY HAS HOME
      if (userData.homeID) {
  
        return {
          success: false,
          message: "User already belongs to a home"
        };
  
      }
  
      // UPDATE HOME MEMBERS
      const homeRef = doc(db, "homes", homeID);
  
      await updateDoc(homeRef, {
  
        memberIDs: arrayUnion(userID)
  
      });
  
      // UPDATE USER HOME
      const userRef = doc(db, "users", userID);
  
      await updateDoc(userRef, {
  
        homeID: homeID,
  
      });
  
  
  
      return {
        success: true,
        message: "Member added successfully"
      };
  
    } catch (error) {
  
      console.log(error);
  
      return {
        success: false,
        message: "Failed to add member"
      };
  
    }
  
  };

// REMOVE MEMBER
export const removeMember = async (
  homeID,
  memberUID
) => {

  try {

    // UPDATE HOME
    const homeRef = doc(db, "homes", homeID);

    await updateDoc(homeRef, {

      memberIDs: arrayRemove(memberUID)

    });

    // REMOVE USER HOME ACCESS
    const userRef = doc(db, "users", memberUID);

    await updateDoc(userRef, {

      homeID: null,

      role: "member"

    });

    return {
      success: true
    };

  } catch (error) {

    console.log(error);

    return {
      success: false
    };

  }

};