"use client";

import React, { FC, ReactElement, useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import ProfileSidebar from "./ProfileSidebar";
import SideBar from "./SideBar";
import { Session } from "next-auth";
import { useSocket } from "@/context/SocketProvider";

interface DashboardProps {
  session: Session;
  chatPartner: Session;
}

const Dashboard: FC<DashboardProps> = ({
  session,
  chatPartner,
}): ReactElement => {
  const [sidePanel, setsidePanel] = useState<boolean>(true);
  return (
    <>
      <SideBar session={session} setsidePanel={setsidePanel} />
      <ChatBox
        chatPartner={chatPartner}
        session={session}
        setsidePanel={setsidePanel}
      />
      <ProfileSidebar setsidePanel={setsidePanel} sidePanel={sidePanel} />
    </>
  );
};

export default Dashboard;
