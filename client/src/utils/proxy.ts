export const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://sneekpeek.onrender.com/api/v1"
    : "http://localhost:4000/api/v1";
