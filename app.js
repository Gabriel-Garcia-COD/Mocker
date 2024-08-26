const express = require('express');
const cors = require('cors');
// const https = require('https');
// const fs = require('fs');
const apiRoutes = require('./routes/apiRoutes');
const db = require('./database/db');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', apiRoutes);

db.authenticate()
    .then(() => {
        console.log("Database connected...");
    })
    .catch((err) => {
        console.error("error: " + err);
    })

//CERTIFICADOS LOCAL
// const options = {
//     key: fs.readFileSync("/home/codgabrielgarcia/Área de Trabalho/certificate/genesyscloudapps_coddera_com_key.txt"),
//     cert: fs.readFileSync("/home/codgabrielgarcia/Área de Trabalho/certificate/genesyscloudapps.coddera.com.crt"),
//     ca: [
//         fs.readFileSync('/home/codgabrielgarcia/Área de Trabalho/certificate/genesyscloudapps.coddera.com.ca-bundle')
//     ]
// };

//CERTIFICADOS SERVIDOR
// const options = {
//    key: fs.readFileSync("/home/ubuntu/certificate/genesyscloudapps.coddera.com_key.txt"),
//     cert: fs.readFileSync("/home/ubuntu/certificate/genesyscloudapps.coddera.com.crt"),
//     ca: [
//             fs.readFileSync('/home/ubuntu/certificate/genesyscloudapps.coddera.com.ca-bundle')
//     ]
//   };

// const options = {
//     key: fs.readFileSync('/Users/gabri/Documents/NOTECODDERA/certificate/genesyscloudapps.coddera.com_key.txt'),
//     cert: fs.readFileSync('/Users/gabri/Documents/NOTECODDERA/certificate/genesyscloudapps.coddera.com.crt'),
//     ca: [
//       fs.readFileSync('/Users/gabri/Documents/NOTECODDERA/certificate/genesyscloudapps.coddera.com.ca-bundle')
//     ]
//   };

// const server = https.createServer(options, app);

db.sync()
    .then(() => {
        // server.listen(PORT, () => {
        //     console.log(`Server is running on port ${PORT}`);
        // });
        app.listen(PORT, () => {
            console.log(`🌏 Server is listening in port: ${PORT}`);
          });
    })
    .catch((err) => {
        console.error("error: " + err);
    })
