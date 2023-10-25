import {
    RiCloseFill, RiArrowDownSLine, RiNotificationFill,  RiFileUserLine, RiNotificationLine,
    RiCheckFill, RiCloseLine, RiUserLine, RiMailLine, RiTimeLine, RiLogoutCircleLine,
    RiSearchLine, RiArrowLeftSLine, RiNavigationLine, RiUploadLine,RiUserReceivedLine,
    RiDownloadLine, RiUser3Line, RiArrowUpSLine, RiCloseCircleLine, RiPhoneLine, RiFileAddLine,
    RiArrowRightSLine, RiPhoneFill,RiMoneyDollarCircleLine, RiUserAddLine

} from "react-icons/ri";

import { FaRegEdit } from "react-icons/fa";
import { CgTrash } from "react-icons/cg";
import { colors } from "./styles"


export function formatDateToString(date){
    if(!date) return ""
    return date.split("T")[0]
} 
  
export const Icons = {
    arrowDown: <RiArrowDownSLine style={{ width: "16px", height: "21px" }} />,
    notificationDark: <RiNotificationFill />,
    fileUser: <RiFileUserLine />,
    login: <RiUser3Line />,
    notificationLight: <RiNotificationLine />,
    check: <RiCheckFill />,
    close: <RiCloseLine />,
    dollarCircle: <RiMoneyDollarCircleLine style={{ width: "27px", height: "27px" }} />,
    user: <RiUserLine style={{ width: "16px", height: "21px" }} />,
    mail: <RiMailLine />,
    time: <RiTimeLine />,
    logoutCircle: <RiLogoutCircleLine />,
    search: <RiSearchLine />,
    arrowLeft: <RiArrowLeftSLine style={{ width: "20px", height: "52px",color:"#616161"  }} />,
    navigationArrow: <RiNavigationLine />,
    upload: <RiUploadLine />,
    download: <RiDownloadLine />,
    closed: <RiCloseFill style={{ width: "20px", height: "20px" }} />,
    arrowUp: <RiArrowUpSLine />,
    closeCircle: <RiCloseCircleLine style={{ color: `${colors.background.light}`, scale: 2 }} />,
    phone: <RiPhoneLine />,
    phoneCheck:<RiPhoneFill style={{ width: "20px", height: "18.48px", color:"#616161"}}/>,
    addFile: <RiFileAddLine />,
    arrowRight: <RiArrowRightSLine style={{ width: "20px", height: "52px", color:"#616161" }} />,
    edit: <FaRegEdit />,
    trash: <CgTrash />,
    userReceived: <RiUserReceivedLine />,
    userAdd: <RiUserAddLine />,
}


