import React from "react";
import { useAuth } from "../../context/Auth/AuthContext";

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return <p>Loading user...</p>;

  return (
    <div>
      <h2>Profile</h2>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>

      {/* {user.sessionIds?.length > 0 && (
        <div>
          <strong>Sessions:</strong> {user.sessionIds.join(", ")}
        </div>
      )}

      {user.practiceIds?.length > 0 && (
        <div>
          <strong>Practices:</strong> {user.practiceIds.join(", ")}
        </div>
      )}

      {user.tacticIds?.length > 0 && (
        <div>
          <strong>Game Tactics:</strong> {user.tacticIds.join(", ")}
        </div>
      )} */}
    </div>
  );
};

export default Profile;
