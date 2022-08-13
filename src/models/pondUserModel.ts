// I don't understand what is the best practice here... Im reading from
// https://stackoverflow.com/questions/60981735/passport-express-typescript-req-user-email-undefined
// that I need to define the interface globally...
// declare global {
//     namespace Express {
//         interface User {

//         }
//     }
// }

interface PondUser extends Express.User {
  id: number;
  username: string;
  email: string;
  googleId: string;
}

export default PondUser;
