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

export function cutString(str, maxLength) {
    if (str.length <= maxLength) {
      return str; // Retorna el string sin cambios si no excede la longitud máxima
    } else {
      return str.substring(0, maxLength) + '...'; // Retorna el string cortado con puntos suspensivos
    }
}

export function differenceBetweenDates(date1, date2) {
  const newDate1 = new Date(date1);  
  const newDate2 = new Date(date2);
  const unDia = 24 * 60 * 60 * 1000; // milisegundos en un día
  const duration = Math.round(Math.abs((newDate2 - newDate1) / unDia));

  if (duration <= 30) {
    if (duration === 0) return "-";
    return `${duration} ${duration === 1 ? "día" : "días"}`;
  } else if (duration <= 365) {
      const meses = Math.floor(duration / 30);
      const diasRestantes = duration % 30;
      return `${meses} ${meses ===1 ? "mes" : "meses"} y ${diasRestantes} ${diasRestantes === 1 ? "día" : "días"}`;
  } else {
      const años = Math.floor(duration / 365);
      const mesesRestantes = Math.floor((duration % 365) / 30);
      const diasRestantes = (duration % 365) % 30;
      return `${años} ${años === 1 ? "año" : "años"}, ${mesesRestantes} ${mesesRestantes === 1 ? "mes" : "meses"} y ${diasRestantes} ${diasRestantes === 1 ? "día" : "días"}`;
  }
}

export function parsedDuration(duration){
  if (duration <= 30) {
    if (duration === 0) return "-";
    return `${duration} ${duration === 1 ? "día" : "días"}`;
  } else if (duration <= 365) {
      const meses = Math.floor(duration / 30);
      const diasRestantes = duration % 30;
      return `${meses} ${meses ===1 ? "mes" : "meses"} y ${diasRestantes} ${diasRestantes === 1 ? "día" : "días"}`;
  } else {
      const años = Math.floor(duration / 365);
      const mesesRestantes = Math.floor((duration % 365) / 30);
      const diasRestantes = (duration % 365) % 30;
      return `${años} ${años === 1 ? "año" : "años"}, ${mesesRestantes} ${mesesRestantes === 1 ? "mes" : "meses"} y ${diasRestantes} ${diasRestantes === 1 ? "día" : "días"}`;
  }
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


