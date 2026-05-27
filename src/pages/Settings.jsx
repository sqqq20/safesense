    // =====================================
    // SettingsPage.jsx
    // =====================================

    import { useEffect, useState } from "react";

    import {
    onAuthStateChanged
    } from "firebase/auth";

    import {
    FaHouseUser,
    FaUserMinus,
    FaUserPlus
    } from "react-icons/fa";

    import { auth } from "../services/Firebase";

    import {
        getCurrentUserData,
        getHomeMembers,
        updateAlertConfig,
        updateQuietHours
      } from "../services/UserService";

    import {
        createHome,
        addMemberByEmail,
        removeMember
      } from "../services/HomeService";

      import {
        FaBell,
        FaSms,
        FaEnvelope
      } from "react-icons/fa";

    export default function SettingsPage() {

    // =====================================
    // STATES
    // =====================================
    const [loading, setLoading] = useState(true);

    const [userData, setUserData] = useState(null);

    const [members, setMembers] = useState([]);

    const [showAddModal, setShowAddModal] = useState(false);

    const [memberEmail, setMemberEmail] = useState("");

    const [addStatus, setAddStatus] = useState("");

    const [showDNDModal, setShowDNDModal] = useState(false);

    const [startHour, setStartHour] = useState("");

    const [endHour, setEndHour] = useState("");

    const hours = 
    [
      "None",

      ...Array.from(
      { length: 24 },
      (_, i) =>
        `${i.toString().padStart(2, "0")}:00`
    )
  ];

    // =====================================
    // AUTH LISTENER
    // =====================================
    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, async (user) => {

        if (!user) {
            setLoading(false);
            return;
        }

        try {

            // =====================================
            // FETCH USER DATA
            // =====================================
            const data = await getCurrentUserData(user.uid);

            setUserData(data);

        } catch (error) {

            console.log(error);

        }

        setLoading(false);

        });

        return () => unsubscribe();

    }, []);




    // =====================================
    // FETCH MEMBERS
    // =====================================
    useEffect(() => {

        const fetchMembers = async () => {

        try {

            if (!userData?.homeID) return;

            const fetchedMembers = await getHomeMembers(
            userData.homeID,
            userData
            );

            setMembers(fetchedMembers);

        } catch (error) {

            console.log(error);

        }

        };

        fetchMembers();

    }, [userData]);




    // =====================================
    // CREATE HOME
    // =====================================
    const handleCreateHome = async () => {

        try {

        const newHomeID = await createHome();

        setUserData(prev => ({
            ...prev,
            homeID: newHomeID,
            role: "host"
        }));

        } catch (error) {

        console.log(error);

        }

    };

    // =====================================
    // TOGGLE ALERT METHOD
    // =====================================
    const handleToggle = async (
        field,
        currentValue
    ) => {
    
        try {
    
        const updatedValue = !currentValue;
    
        // =====================================
        // UPDATE FIRESTORE
        // =====================================
        await updateAlertConfig(
            auth.currentUser.uid,
            field,
            updatedValue
        );
    
        // =====================================
        // UPDATE UI
        // =====================================
        setUserData(prev => ({
            ...prev,
            [field]: updatedValue
        }));
    
        } catch (error) {
    
        console.log(error);
    
        }
    
    };

    // =====================================
// ADD MEMBER
// =====================================
const handleAddMember = async () => {

    try {
  
      if (!memberEmail) return;
  
      const result = await addMemberByEmail(
        homeID,
        memberEmail
      );
  
      setAddStatus(result.message);
  
      // =====================================
      // SUCCESS
      // =====================================
      if (result.success) {
  
        const fetchedMembers = await getHomeMembers(
          homeID,
          userData
        );
  
        setMembers(fetchedMembers);
  
        setMemberEmail("");
  
      }
  
    } catch (error) {
  
      console.log(error);
  
    }
  
  };

  const handleRemoveMember = async (
    memberUID
  ) => {
  
    try {
  
      const result = await removeMember(
        homeID,
        memberUID
      );
  
      if (result.success) {
  
        // =====================================
        // REFRESH MEMBERS
        // =====================================
        const fetchedMembers = await getHomeMembers(
          homeID,
          userData
        );
  
        setMembers(fetchedMembers);
  
      }
  
    } catch (error) {
  
      console.log(error);
  
    }
  
  };
  
// =====================================
// UPDATE DND
// =====================================
const handleUpdateDND = async () => {

    try {
  
      await updateQuietHours(
        auth.currentUser.uid,
        startHour,
        endHour
      );
  
      setUserData(prev => ({
        ...prev,
        quietHoursStartTime: startHour,
        quietHoursEndTime: endHour
      }));
  
      setShowDNDModal(false);
  
    } catch (error) {
  
      console.log(error);
  
    }
  
  };

    // =====================================
    // LOADING
    // =====================================
    if (loading) {

        return (
        <div style={{
            minHeight: "100vh",
            background: "#03111f",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            Loading...
        </div>
        );

    }

    const isHost = userData?.role === "host";

    const homeID = userData?.homeID || null;


    return (

        <div style={{
        minHeight: "100vh",
        padding: "30px",
        color: "white",
        fontFamily: "sans-serif"
        }}>


        {/* ===================================== */}
        {/* MAIN GRID */}
        {/* ===================================== */}
        <div style={{
            display: "grid",
            gridTemplateColumns:   "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "16px"
        }}>



            {/* ===================================== */}
            {/* LEFT COLUMN */}
            {/* ===================================== */}
            <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px"
            }}>



            {/* ===================================== */}
            {/* ACCOUNT PROFILE */}
            {/* ===================================== */}
            <Card>

                <SectionTitle text="ACCOUNT PROFILE" />

                <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "18px",
                width: "95%",
                }}>

                <Input
                    label="USERNAME"
                    value={userData?.username || ""}
                />

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px"
                }}>

                    <Input
                    label="EMAIL ADDRESS"
                    value={userData?.email || ""}
                    />

                    <Input
                    label="PHONE NUMBER"
                    value={userData?.contactNumber || ""}
                    />

                </div>

                </div>

            </Card>


            {/* ===================================== */}
            {/* USER MANAGEMENT */}
            {/* ===================================== */}
            <Card>

                <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
                }}>

                <SectionTitle
                    text={isHost ? "USER MANAGEMENT" : "USER LIST"}
                />

                {isHost && homeID && (
                    <button style={buttonPrimary}   onClick={() => setShowAddModal(true)}>
                    <FaUserPlus />
                    ADD MEMBER
                    </button>
                )}

                {/* ===================================== */}
                {/* ADD MEMBER MODAL */}
                {/* ===================================== */}
                {showAddModal && (
                
                <div style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.65)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 999
                }}>
                
                  <div style={{
                    width: "420px",
                    background: "#071426",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "18px",
                    padding: "24px"
                  }}>
                
                    <div style={{
                      fontSize: "22px",
                      fontWeight: "bold",
                      marginBottom: "18px"
                    }}>
                      ADD MEMBER
                    </div>
                
                
                    <div style={{
                      color: "#94a3b8",
                      fontSize: "13px",
                      marginBottom: "12px"
                    }}>
                      Enter member's email
                    </div>
                
                
                    <input
                      value={memberEmail}
                      onChange={(e) =>
                        setMemberEmail(e.target.value)
                      }
                      placeholder="member@email.com"
                      style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "10px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "#0f172a",
                        color: "white",
                        outline: "none",
                        marginBottom: "16px"
                      }}
                    />


                    {addStatus && (
                    
                      <div style={{
                        color: "#22c55e",
                        fontSize: "13px",
                        marginBottom: "14px"
                      }}>
                        {addStatus}
                      </div>

                    )}

                
                    <div style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "12px"
                    }}>
                    
                      <button
                        onClick={() => {
                          setShowAddModal(false);
                          setAddStatus("");
                        }}
                        style={buttonOutline}
                      >
                        CANCEL
                      </button>
                    
                    
                      <button
                        onClick={handleAddMember}
                        style={buttonPrimary}
                      >
                        ADD
                      </button>
                    
                    </div>
            
                </div>
            
            </div>

            )}
            </div>




                {/* ===================================== */}
                {/* NO HOME STATE */}
                {/* ===================================== */}
                {isHost && !homeID ? (

                <div style={{
                    height: "220px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center"
                }}>

                    <div style={{
                    width: "78px",
                    height: "78px",
                    borderRadius: "20px",
                    background: "rgba(34,211,238,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                    color: "#22d3ee",
                    fontSize: "38px"
                    }}>
                    <FaHouseUser />
                    </div>

                    <div style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    marginBottom: "10px"
                    }}>
                    CREATE HOME
                    </div>

                    <div style={{
                    color: "#94a3b8",
                    fontSize: "13px",
                    marginBottom: "24px",
                    maxWidth: "280px",
                    lineHeight: "1.5"
                    }}>
                    Initialize a secure monitoring home
                    and manage member access.
                    </div>

                    <button
                    style={buttonPrimaryLarge}
                    onClick={handleCreateHome}
                    >
                    CREATE
                    </button>

                </div>

                ) : (

                <div style={{ marginTop: "18px" }}>

                    <div style={{
                    display: "grid",
                    gridTemplateColumns: isHost
                        ? "2fr 1fr 1fr 1fr"
                        : "2fr 1fr 1fr",
                    padding: "10px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    color: "#94a3b8",
                    fontSize: "11px",
                    letterSpacing: "1px"
                    }}>
                    <div>IDENTITY</div>
                    <div>ROLE</div>
                    {isHost && <div>ACTIONS</div>}
                    </div>



                    {members.map((member, index) => (

                    <div
                        key={index}
                        style={{
                        display: "grid",
                        gridTemplateColumns: isHost
                            ? "2fr 1fr 1fr 1fr"
                            : "2fr 1fr 1fr",
                        alignItems: "center",
                        padding: "14px 0",
                        borderBottom: "1px solid rgba(255,255,255,0.05)"
                        }}
                    >

                        <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                        }}>

                        <div style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "50%",
                            background: "#0f172a",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#38bdf8",
                            fontWeight: "bold",
                            fontSize: "13px"
                        }}>
                            {member.username[0].toUpperCase()}
                        </div>

                        <div style={{ fontSize: "14px" }}>
                            {member.username}

                            {member.uid === auth.currentUser?.uid && (
                          
                          <span style={{
                            fontSize: "11px",
                            padding: "2px 8px",
                            color: "#22d3ee",
                          }}>
                            (You)
                          </span>

                        )}
                        </div>

                        </div>


                        <div>
                        <RoleBadge role={member.role} />
                        </div>

                        {isHost && (
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          height: "100%"
                        }}>

                            {member.role !== "HOST" && (
                            <button style={removeButton}
                            onClick={() =>
                              handleRemoveMember(member.uid)
                            }>
                                <FaUserMinus />
                            </button>
                            )}

                        </div>
                        )}

                    </div>

                    ))}

                </div>

                )}

            </Card>

            </div>





            {/* ===================================== */}
            {/* RIGHT COLUMN */}
            {/* ===================================== */}
            <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px"
            }}>


            {/* ===================================== */}
            {/* ALERT CONFIG */}
            {/* ===================================== */}
            <Card>

                <SectionTitle text="ALERT CONFIGURATION" />

                <div style={{
                marginTop: "18px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                textAlign: "left",
                gap: "18px"
                }}>

                <ToggleRow
                  title="Push Notifications"
                  description="Browser / Mobile Alerts"
                  enabled={!!userData?.notifyByPush}
                  icon={<FaBell />}
                  onToggle={() =>
                    handleToggle(
                      "notifyByPush",
                      userData?.notifyByPush
                    )
                  }
                />

                <ToggleRow
                  title="Messaging Alerts"
                  description="Telegram Messaging Alerts"
                  enabled={!!userData?.notifyBySMS}
                  icon={<FaSms />}
                  onToggle={() =>
                    handleToggle(
                      "notifyBySMS",
                      userData?.notifyBySMS
                    )
                  }
                />

                <ToggleRow
                  title="Email Alerts"
                  description="Email Emergency Notifications"
                  enabled={!!userData?.notifyByEmail}
                  icon={<FaEnvelope />}
                  onToggle={() =>
                    handleToggle(
                      "notifyByEmail",
                      userData?.notifyByEmail
                    )
                  }
                />

                </div>

            </Card>


            {/* ===================================== */}
            {/* DND */}
            {/* ===================================== */}
            <Card>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "18px"
            }}>
                <SectionTitle text="DO NOT DISTURB" />
                
                <button 
                    style={buttonPrimary}   
                    onClick={() => setShowDNDModal(true)}
                >
                    CONFIGURE
                </button>

                </div>
                <div style={{
                marginTop: "18px",
                padding: "16px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.04)"
                }}>

                <div style={{
                    fontSize: "13px",
                    color: "#94a3b8",
                    marginBottom: "8px"
                }}>
                    Quiet Hours
                </div>

                <div style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                }}>
                    {
                    userData?.quietHoursStartTime &&
                    userData?.quietHoursEndTime &&
                    userData.quietHoursStartTime !== "None" &&
                    userData.quietHoursEndTime !== "None"
                        ? `${userData.quietHoursStartTime} - ${userData.quietHoursEndTime}`
                        : "Not Set"
                    }
                </div>
                    
                {showDNDModal && (
                
                <div style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.65)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 999
                }}>
                
                  <div style={{
                    width: "420px",
                    background: "#071426",
                    borderRadius: "18px",
                    padding: "24px",
                    border: "1px solid rgba(255,255,255,0.08)"
                  }}>
                
                    <div style={{
                      fontSize: "22px",
                      fontWeight: "bold",
                      marginBottom: "20px"
                    }}>
                      QUIET HOURS
                    </div>
                
                
                    <div style={{
                      display: "flex",
                      gap: "14px",
                      marginBottom: "20px"
                    }}>
                    
                      <div style={{ flex: 1 }}>
                
                        <div style={{
                          fontSize: "12px",
                          color: "#94a3b8",
                          marginBottom: "8px"
                        }}>
                          START
                        </div>
                    
                        <select
                          value={startHour}
                          onChange={(e) =>
                            setStartHour(e.target.value)
                          }
                          style={timeInput}
                        >
                        
                          {hours.map((hour) => (
                          
                            <option
                              key={hour}
                              value={hour}
                            >
                              {hour}
                            </option>

                          ))}

                        </select>

                      </div>
                      
                      
                      
                      <div style={{ flex: 1 }}>
                      
                        <div style={{
                          fontSize: "12px",
                          color: "#94a3b8",
                          marginBottom: "8px"
                        }}>
                          END
                        </div>
                    
                        <select
                          value={endHour}
                          onChange={(e) =>
                            setEndHour(e.target.value)
                          }
                          style={timeInput}
                        >
                        
                          {hours.map((hour) => (
                          
                            <option
                              key={hour}
                              value={hour}
                            >
                              {hour}
                            </option>

                          ))}

                        </select>

                      </div>
                      
                    </div>
                      
                      
                    <div style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "12px"
                    }}>
                    
                      <button
                        style={buttonOutline}
                        onClick={() => setShowDNDModal(false)}
                      >
                        CANCEL
                      </button>
                
                      <button
                        style={buttonPrimary}
                        onClick={handleUpdateDND}
                      >
                        SAVE
                      </button>
                
                    </div>
                
                  </div>
                
                </div>

                )}
                </div>

            </Card>

            </div>

        </div>

        </div>

    );

    }





    // =====================================
    // CARD
    // =====================================
    function Card({ children }) {

    return (
        <div style={{
        background: "rgba(6,20,37,0.87)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "18px",
        padding: "20px"
        }}>
        {children}
        </div>
    );

    }




    // =====================================
    // SECTION TITLE
    // =====================================
    function SectionTitle({ text }) {

    return (
        <div style={{
        color: "#22d3ee",
        fontSize: "17px",
        fontWeight: "bold",
        letterSpacing: "1px",
        textAlign:"left"
        }}>
        {text}
        </div>
    );

    }




    // =====================================
    // INPUT
    // =====================================
    function Input({ label, value }) {

    return (
        <div>

        <div style={{
            color: "#94a3b8",
            fontSize: "12px",
            marginBottom: "8px"
        }}>
            {label}
        </div>

        <input
            value={value}
            readOnly
            style={{
            width: "100%",
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            padding: "12px",
            color: "white",
            outline: "none"
            }}
        />

        </div>
    );

    }




    // =====================================
    // ROLE BADGE
    // =====================================
    function RoleBadge({ role }) {

    const color =
        role === "HOST"
        ? "#06b6d4"
        : "#64748b";

    return (
        <div style={{
        display: "inline-block",
        padding: "5px 12px",
        borderRadius: "5px",
        background: `${color}22`,
        border: `1px solid ${color}`,
        color,
        fontSize: "11px",
        fontWeight: "bold"
        }}>
        {role}
        </div>
    );

    }


    function ToggleRow({
        title,
        description,
        enabled,
        onToggle,
        icon
      }) {
      
        return (
      
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
      
            {/* LEFT SIDE */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              textAlign: "left",
              gap: "14px",
              width: "240px"
            }}>
      
              {/* ICON */}
              <div style={{
                color: "#22d3ee",
                fontSize: "18px",
              }}>
                {icon}
              </div>
      
      
              {/* TEXT */}
              <div>
      
                <div style={{
                  fontWeight: "bold",
                  marginBottom: "4px"
                }}>
                  {title}
                </div>
      
                <div style={{
                  color: "#94a3b8",
                  fontSize: "11px",
                  lineHeight: "1.4"
                }}>
                  {description}
                </div>
      
              </div>
      
            </div>
      
      
      
            {/* TOGGLE */}
            <div
              onClick={onToggle}
              style={{
                width: "52px",
                height: "24px",
                borderRadius: "999px",
                background: enabled
                  ? "#22c55e"
                  : "#334155",
                position: "relative",
                cursor: "pointer",
                transition: "0.2s"
              }}
            >
      
              <div style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "white",
                position: "absolute",
                top: "3px",
                left: enabled ? "30px" : "5px",
                transition: "0.2s"
              }} />
      
            </div>
      
          </div>
      
        );
      
      }

    const buttonPrimary = {
    background: "#06b6d4",
    border: "none",
    color: "white",
    padding: "10px 18px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "8px"
    };

    const buttonPrimaryLarge = {
    background: "#06b6d4",
    border: "none",
    color: "white",
    padding: "12px 28px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px"
    };

    const buttonOutline = {
    background: "transparent",
    border: "1px solid #06b6d4",
    color: "#06b6d4",
    padding: "10px 18px",
    borderRadius: "5px",
    cursor: "pointer",
    width: "fit-content",
    fontWeight: "bold"
    };

    const removeButton = {
      width: "32px",
      height: "32px",
      border: "none",
      background: "transparent",
      color: "#ef4444",
      cursor: "pointer",
      fontSize: "14px"
    };

    const timeInput = {
        width: "100%",
        background: "#0f172a",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "8px",
        padding: "12px",
        color: "white",
        outline: "none"
      };