import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
  dotenv.config({path: './.env',});

  export const envMode = process.env.NODE_ENV?.trim() || 'DEVELOPMENT';
  const port = process.env.PORT || 3000;


  const app = express();


 app.use(express.json());
app.use(express.urlencoded({extended: true}));
const allowedOrigins = ['http://localhost:3000']; // List of allowed origins

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and credentials
}));
app.use(cookieParser());


  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

  // your routes here

  import organizationRoutes from "./routes/organization.routes.js"
  import employeeRoutes from "./routes/employee.routes.js"
  import adminRoutes from "./routes/admin.routes.js"
  import userRoutes from "./routes/users.routes.js"
  import  taskRoutes from "./routes/task.routes.js" 

  app.use("/api/v1/organization",organizationRoutes)
  app.use("/api/v1/employee",employeeRoutes)
  app.use("/api/v1/admin",adminRoutes)
  app.use("/api/v1/user",userRoutes)
  app.use("/api/v1/task",taskRoutes)


  
  app.get("*", (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Page not found'
    });
  });

  
  
  
  app.listen(port, () => console.log('Server is working on Port:'+port+' in '+envMode+' Mode.'));