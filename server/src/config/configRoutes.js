// import allRoutes from "../routes/allRoutes.js";

// const configRoutes = (app) => {
//   // Config routes here with error checking
//   if (allRoutes.authRoutes) app.use("/api/auth", allRoutes.authRoutes);
//   if (allRoutes.interviewRoutes) app.use("/api/interviews", allRoutes.interviewRoutes);
//   if (allRoutes.userRoutes) app.use("/api/users", allRoutes.userRoutes);
//   if (allRoutes.chatRoutes) app.use("/api/chat", allRoutes.chatRoutes);
//   if (allRoutes.commentsRoutes) app.use("/api/comments", allRoutes.commentsRoutes);
//   if (allRoutes.adminRoutes) app.use("/api/admin", allRoutes.adminRoutes);

//   app.get("/", (req, res) => {
//     res.json({ message: "Server is running successfully!" });
//   });
// }

// export default configRoutes;


import allRoutes from "../routes/allRoutes.js";

// const configRoutes = (app) => {
//   // Config routes here with error checking
//   if (allRoutes.authRoutes) app.use("/api/auth", allRoutes.authRoutes);
//   if (allRoutes.interviewRoutes) app.use("/api/interviews", allRoutes.interviewRoutes);
//   if (allRoutes.userRoutes) app.use("/api/users", allRoutes.userRoutes);
//   if (allRoutes.chatRoutes) app.use("/api/chat", allRoutes.chatRoutes);
//   if (allRoutes.commentsRoutes) app.use("/api/comments", allRoutes.commentsRoutes);
//   if (allRoutes.adminRoutes) app.use("/api/admin", allRoutes.adminRoutes);
// }

// export default configRoutes;


const configRoutes = (app) => {
  // Config routes here with error checking
  if (allRoutes.authRoutes) app.use("/api/auth", allRoutes.authRoutes);
  if (allRoutes.interviewRoutes) app.use("/api/interviews", allRoutes.interviewRoutes);
  if (allRoutes.userRoutes) app.use("/api/users", allRoutes.userRoutes);
  if (allRoutes.chatRoutes) app.use("/api/chat", allRoutes.chatRoutes);
  if (allRoutes.commentsRoutes) app.use("/api/comments", allRoutes.commentsRoutes);
  if (allRoutes.adminRoutes) app.use("/api/admin", allRoutes.adminRoutes);

  // ✅ Default route to prevent 404 on "/"
  // app.get("/", (req, res) => {
  //   res.json({ message: "Server is running successfully!" });
  // });

  // app.get("/this", (req, res) => {
  //   res.json({ message: "Hello from this route" });
  // });

};

export default configRoutes;
