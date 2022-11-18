export const userSchema = {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  displayName: { type: String, required: true },
  name: {
    familyName: { type: String, required: true },
    givenName: { type: String, required: true }
  },
  profileUrl: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  photo: { type: String, required: true }
};
