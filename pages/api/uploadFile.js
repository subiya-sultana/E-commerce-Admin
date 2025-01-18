// uploadFile to take image from input and store that image into cloud ( i.e firebase ) and return te imageUrl to product form
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { initializeApp } from "firebase/app";
import multiparty from "multiparty";
import fs from "fs";

const firebaseConfig = {
    apiKey: "AIzaSyAM109Nf7auRvu2aiDtjmpsop_gTJwykuY",
    authDomain: "weblog-s.firebaseapp.com",
    projectId: "weblog-s",
    storageBucket: "weblog-s.appspot.com",
    messagingSenderId: "620855708799",
    appId: "1:620855708799:web:85b6b8bdcc2646fe8c434a",
    measurementId: "G-MDKEJDYBL3",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default async function handle(req, res) {
    if (req.method === "POST") {
        const form = new multiparty.Form();

        try {
            // Parse form data
            const { files } = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    if (err) reject(err);
                    resolve({ fields, files });
                });
            });

            // Access and validate file
            const file = files.file[0];
            if (!file || !fs.existsSync(file.path)) {
                throw new Error("Uploaded file not found");
            }

            // Read file content and set Content-Type
            const fileBuffer = fs.readFileSync(file.path);
            const fileName = file.originalFilename || `uploaded-${Date.now()}`;
            const mimeType = file.headers["content-type"]; // Get the MIME type from the uploaded file
            const storageRef = ref(storage, `EcoCart-images/${fileName}`);

            // Upload file to Firebase Storage with metadata
            const metadata = {
                contentType: mimeType, // Set the correct MIME type
            };
            await uploadBytes(storageRef, fileBuffer, metadata);

            // Construct public URL
            const liveLink = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${encodeURIComponent(`EcoCart-images/${fileName}`)}?alt=media`;

            console.log("File uploaded successfully. Public URL:", liveLink);

            // Respond with public URL
            res.status(200).json({ url: liveLink });
        } catch (error) {
            console.error("Error during file upload:", error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}

// Disable default body parsing for multipart data
export const config = {
    api: { bodyParser: false },
};






// // Taking photos from ProductForm and creating url for the Photos

// // Multipart form data: A REST API format that combines multiple data sets into a single body.
// import multiparty from 'multiparty'; 

// export default async function handle(req,res){
//     const form = new multiparty.Form()
//     const {fields,files} = await new Promise((resolve,reject) => {
//         form.parse(req, (err, fields, files) => {

//             if (err) reject(err);
//             resolve({fields,files});

//         });
//     });
//     console.log("file: ", files.file)
//     console.log("length of file: ", files.file.length )
    
//     res.status(200).json('ok')
// }

// // not parsing the our request to json
// export const config = {
//     api: {bodyParser: false},
// };


