import mysql  from "mysql2/promise";
import { formattedResponse } from "./utils";
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from "./constant";
import { QueryResult } from "./types";
let pool: mysql.Pool;
async function createPool() {
    return new Promise(async (resolve, reject) => {
      try {
        let mysql_config = {
          host: DB_HOST,
          user: DB_USER,
          password: DB_PASSWORD,
          database: DB_NAME,
          port: DB_PORT,
          waitForConnections: true,
          queueLimit: 0,
          connectionLimit: 500,
        };
  
        pool = await mysql.createPool(mysql_config);
     
  
        // console.log("Database connection pool created");
        resolve(formattedResponse(201, pool, "Database connection pool created"));
      } catch (error:any) {
        console.log("Error creating database connection pool:", error.code);
        resolve(
          formattedResponse(500, error, "Error creating database connection pool")
        );
      }
    });
  }
  
  export function executeQuery(query: string, values?: any[]) :Promise<QueryResult> {
    return new Promise(async (resolve, reject) => {
      let connection;
      try {
        // console.log("Executing query:", query, values);
  
        if (!pool) {
          console.log("No pool.");
          await createPool();
        }
  
        connection = await pool.getConnection();
  
        const [rows] = await connection.query({
          sql: query,
          timeout: 60, // 60sec, fetch this time from constant.js file
          values: values,
        });
  
        // console.log("Query results:", rows);
  
        // pool.data.end();
  
        resolve(formattedResponse(200, rows, "Query executed successfully"));
      } catch (error:any) {
        console.log("Error executing query:", error.code, error);
        // console.log("Error executing query:", error.code, error.message);
  
        resolve(
          formattedResponse(
            500,
            error.code,
            "Error executing query " + error.message
          )
        );
      } finally {
        if (connection) {
          connection.release();
        }
      }
    });
  };

