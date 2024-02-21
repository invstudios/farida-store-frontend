"use client"
import React, { useContext, useEffect, useState } from 'react'
import Icon from './Icon'
import { FaRegUser } from "react-icons/fa";
import UserDrop from './UserDrop';

import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '@/contexts/StoreContext';
import Link from 'next/link';
import Cookies from 'js-cookie';

    


const FullUserIcon = () => {

  const { userDrop, user,loginForm } = useContext(StoreContext)
const [uiCondition,setUiCondition] = useState(!Cookies.get("credentials"))
  
  //  const firebaseUiCondition = ! user?.userData?.uid?.length ?? 0 > 0
  

  
    useEffect(() => {
        setUiCondition(!Cookies.get("credentials"))
    },[user.isLoading,loginForm.isLoading])
  

  return (
    <div onMouseOver={userDrop.displayUserMenu} onMouseLeave={userDrop.hideUserMenu}>
       <Link href={uiCondition ?"/login":"user"}>
          <Icon icon={<FaRegUser />} hasBorder={true}   />
    </Link>
        
     <UserDrop />
         
      
      </div >
  )
}

export default observer(FullUserIcon)