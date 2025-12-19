import jwt from "jsonwebtoken";

const genToken = async (userId: string) => {
  try {
    if (!process.env.JWT_SECRET) {
      console.log("JWT_SECRET secret not found");
      return;
    }
    const token = jwt.sign({ data: userId }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });
    return token;
  } catch (error) {
    console.log("error while generating token : ", error);
    return;
  }
};
