import express from "express";
import controllers from "./controller.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://0.0.0.0:3000");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", controllers.homeController);
app.get("/post", controllers.postController);
app.post("/logError", controllers.logErrorController);

app.listen({ port: 8080, host: "0.0.0.0" }, () => {
  console.log("server is running on port 8080");
});
