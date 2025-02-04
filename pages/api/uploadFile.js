import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
import multiparty from "multiparty";
import fs from "fs";
import path from "path";
import { isAdminRequest } from "./auth/[...nextauth]";
import { mongooseConnect } from "@/lib/mongoose";

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
    try {
        await mongooseConnect();  // Connect to database
        await isAdminRequest(req, res);  // Ensure admin access

        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        // Parse the form data
        const form = new multiparty.Form();
        const { files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve({ fields, files });
            });
        });

        if (!files.file || files.file.length === 0) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Access the uploaded file
        const file = files.file[0];
        const fileBuffer = fs.readFileSync(file.path);
        const fileName = `${Date.now()}-${file.originalFilename}`;
        const storageRef = ref(storage, `EcoCart-images/${fileName}`);

        // Upload file to Firebase Storage
        const uploadTask = uploadBytesResumable(storageRef, fileBuffer, {
            contentType: file.headers["content-type"],
        });

        // Wait for upload to complete and get URL
        uploadTask.on(
            "state_changed",
            null,
            (error) => {
                console.error("Upload error:", error);
                return res.status(500).json({ error: "Upload failed" });
            },
            async () => {
                const downloadURL = await getDownloadURL(storageRef);
                res.status(200).json({ url: downloadURL });
            }
        );

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: error.message });
    }
}

// Disable body parsing for multipart form data
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


