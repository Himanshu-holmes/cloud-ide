// const { PORT, DB_URI, DB_NAME} = require('./constant');

// const mongoose = require('mongoose');
// const app = require('./app');


// ;(async()=>{
//     try {
//     const connectionInstance = await  mongoose.connect(`${DB_URI}/${DB_NAME}`);
    
//      app.on('error', (error) => {
//         console.log(`Error connecting to the database: ${error}`);
//     }
//     );
//         console.log('Database connected !! connected to host ::',connectionInstance.connection.host);

//         app.listen(PORT,()=>{
//             console.log(`Server is running on port ${PORT}`);
//         })
//         // console.log("connectionInstance",connectionInstance);
//         // console.log("connection DB",connectionInstance.connection.db);
//     } catch (error) {
//         console.log('Database connection failed');
//         console.log(error);
//         process.exit(1);
//     }
// })();

