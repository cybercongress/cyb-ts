import React, { Component } from 'react';

import {
  MenuContainer,
  // Bookmarks,
  // LogoLink,
  AddMenuItem,
  AddMenuItemReject,
  ReportLinkContainer,
  AddMenuItemContainer
} from '@cybercongress/gravity';

import { Bookmarks } from '../../components/appMenu/AppMenu';

const AppMenu = ({ menuItems }) => {
  return (
    <MenuContainer>
      <Bookmarks items={menuItems} />
      <ReportLinkContainer>
        {/* <a
                      target='__blank'
                      href='https://github.com/cybercongress/cyb'
                    >
                    Find a bug?
                    </a> */}
      </ReportLinkContainer>
    </MenuContainer>
  );
};

export default AppMenu;
