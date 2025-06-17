import React from 'react';
import "../CSS/profile.css"
import UserIcon from "../../assets/circuitsMenu/userIcon.png"

const Profile = () => {
    return (
        <div style={{ height: '100%' }}>
            <div className="header2">
                <img className='profileUserIcon'
                     src="../../assets/circuitsMenu/userIcon.png"></img>
                <span className='profileUserName'>UserName</span>
            </div>
            <div className='profile'>
                <div className='profileToEdit'>
                    <img className='userIconToEdit'
                         src="../../assets/circuitsMenu/userIcon.png">
                    </img>
                    <span className='userNameToEdit'>UserName</span>
                </div>
                <button className='editProfileButton'>
                    <div className='editProfileButtonText'>
                        Edit Profile
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Profile;