import React from 'react';
import "../CSS/profile.css"
import UserIcon from "../../assets/circuitsMenu/userIcon.png"

const Profile = () => {
  return (
    <div className="profile-container">
      <div className="header">
        <div className="user-info">
          <div className='profileUserName'>UserName</div>
          <img className='profileUserIcon'
               src="../../assets/circuitsMenu/userIcon.png"
               alt="User Profile"/>
        </div>
      </div>
      <div className='content-container'>
        <div className='profile'>
          <div className='profileToEdit'>
            <img className='userIconToEdit'
                 src="../../assets/circuitsMenu/userIcon.png"
                 alt="Large Profile">
            </img>
            <span className='userNameToEdit'>UserName</span>
          </div>
          <button className='editProfileButton'>
          <span className='editProfileButtonText'>
            Edit Profile
          </span>
          </button>
        </div>
        <div className="vertical-separator"></div>
        <div className='projectsPanel'>
                <span className='projectPanelName'>
                    My projects
                </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;