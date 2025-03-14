// const authenticateUser = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Unauthorized" })
//     }

//     const token = authHeader.split("Bearer ")[1]
//     const decodedToken = await auth.verifyIdToken(token)
//     req.user = decodedToken
//     next()
//   } catch (error) {
//     console.error("Authentication error:", error)
//     return res.status(401).json({ message: "Unauthorized from middleware" })
//   }
// }
// export default authenticateUser;
