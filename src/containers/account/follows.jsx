import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TableEv as Table, Pane } from '@cybercongress/gravity';
import { TextTable, Cid } from '../../components';
import { trimString } from '../../utils/utils';
import Noitem from './noItem';
import AvatarIpfs from './avatarIpfs';

function FollowsTab({ following, followers, node }) {
  const [friendsData, setFriendsData] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [followersData, setFollowersData] = useState([]);

  useEffect(() => {
    if (following.length > 0 && followers.length > 0) {
      const followingArr = [];
      const followersArr = followers.slice();
      const friendsArr = [];

      following.forEach(item => {
        if (followersArr.indexOf(item) !== -1) {
          const index = followersArr.indexOf(item);
          followersArr.splice(index, 1);
          friendsArr.push(item);
        } else {
          followingArr.push(item);
        }
      });
      setFollowingData(followingArr);
      setFollowersData(followersArr);
      setFriendsData(friendsArr);
    } else {
      if (following.length > 0 && followers.length === 0) {
        setFollowingData(following);
      }
      if (following.length === 0 && followers.length > 0) {
        setFollowersData(followers);
      }
    }
  }, [following, followers]);

  const friendsItems = friendsData.map(item => {
    return (
      <AvatarIpfs key={item} showAddress node={node} addressCyber={item} />
    );
  });

  const followingItems = followingData.map(item => {
    return (
      <AvatarIpfs key={item} showAddress node={node} addressCyber={item} />
    );
  });

  const followersItems = followersData.map(item => {
    return (
      <AvatarIpfs key={item} showAddress node={node} addressCyber={item} />
    );
  });

  return (
    <Pane className="contentItem">
      <Pane marginBottom="20px">
        <Pane marginBottom="10px" fontSize="20px">
          Friends
        </Pane>
        {Object.keys(friendsItems).length > 0 ? (
          <Pane
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(100px, 100px))"
            width="100%"
            gridGap="10px"
          >
            {friendsItems}
          </Pane>
        ) : (
          <Noitem text="No Friends" />
        )}
      </Pane>
      <Pane marginBottom="20px">
        <Pane marginBottom="10px" fontSize="20px">
          Following
        </Pane>
        {Object.keys(followingItems).length > 0 ? (
          <Pane
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(100px, 100px))"
            width="100%"
            gridGap="10px"
          >
            {followingItems}
          </Pane>
        ) : (
          <Noitem text="No Following" />
        )}
      </Pane>
      <Pane>
        <Pane marginBottom="10px" fontSize="20px">
          Followers
        </Pane>
        {Object.keys(followersItems).length > 0 ? (
          <Pane
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(100px, 100px))"
            width="100%"
            gridGap="10px"
          >
            {followersItems}
          </Pane>
        ) : (
          <Noitem text="No Followers" />
        )}
      </Pane>
    </Pane>
  );
  // return <Noitem text="No follows" />;
}

export default FollowsTab;
