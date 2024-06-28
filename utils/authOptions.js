import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/config/database";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;
        console.log("credential", credentials);

        try {
          await connectDB();
          const user = await User.findOne({ email });

          if (!user) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            return null;
          }

          const userObject = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };

          console.log(userObject);

          return userObject;
        } catch (error) {
          console.log(error);
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      console.log("session", session, "token", token);
      if (token?.id || token?.sub) {
        session.user.id = token.id || token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        console.log("id", user.id);
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/" },
};
