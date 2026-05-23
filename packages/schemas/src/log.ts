export enum LogCategory {
  Route = "Route",
  DAL = "DAL",
  Repo = "Repo",
  Middleware = "Middleware",
  DB = "DB",
}

export enum LogAction {
  // Auth
  VerifyToken = "VerifyToken",
  SyncClerkUser = "SyncClerkUser",
  GetSession = "GetSession",

  // User
  CreateUser = "CreateUser",
  UpdateUser = "UpdateUser",
  DeleteUser = "DeleteUser",
  GetUserDetails = "GetUserDetails",
}
