// src/plugins/inactivity.js
import { signOut, getAuth } from "firebase/auth";

let inactivityTimer;
let routerInstance = null;

const logoutUser = async () => {
  const auth = getAuth();

  if (!auth.currentUser) return;

  await signOut(auth);

  const userData = useCookie?.("userData");
  const accessToken = useCookie?.("accessToken");

  if (userData) userData.value = null;
  if (accessToken) accessToken.value = null;

  alert("Has sido desconectado por inactividad.");
  location.reload();
  console.log("RouterInstance:", routerInstance);

  // Validación segura
  if (routerInstance && typeof routerInstance.push === "function") {
    const routeName = routerInstance.currentRoute?.value?.name;
    if (routeName !== "login") {
      routerInstance.push("/login");
    }
  } else {
    console.warn("routerInstance no es válido o no tiene método push");
  }
};

const resetInactivityTimer = () => {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(logoutUser, 8 * 60 * 60 * 1000);
};

const setupInactivityLogout = (router) => {
  console.log("setupInactivityLogout llamado");
  routerInstance = router;

  const events = ["mousemove", "keydown", "mousedown", "touchstart"];
  events.forEach((event) =>
    window.addEventListener(event, resetInactivityTimer)
  );

  resetInactivityTimer();
};

export default setupInactivityLogout;
