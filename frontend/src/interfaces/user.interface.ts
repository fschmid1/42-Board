export interface User {
  _id: string;
  username: string;
  intraId: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  profileUrl: string;
  email: string;
  phoneNumber: string;
  photo: string;
}
