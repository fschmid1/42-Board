export interface User {
  _id: string;
  username: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  profileUrl: string;
  email: string;
  phoneNumber: string;
  photos: string;
}
