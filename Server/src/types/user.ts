import Event from "./event.js";

export default interface User {
  first_name: string;
  last_name: string;
  email: string;
  timeZone: string;
  password: string;
  events?: Event[];
}

export interface userEvents extends User, Document { }