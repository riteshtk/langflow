import { v4 as uuidv4 } from "uuid";
export const createNewSessionName = () => {
  const now = new Date();
  const dateStr = now.toISOString().replace(/[-:T]/g, '').slice(0, 12); // YYYYMMDDHHMM
  const sessionId = `Session-${dateStr}-${uuidv4().slice(0, 8)}`;
  return sessionId;
  // return `Session ${new Date().toLocaleString("en-US", {
  //   day: "2-digit",
  //   month: "short",
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   hour12: false,
  //   second: "2-digit",
  //   timeZone: "UTC",
  // })}`;
};
