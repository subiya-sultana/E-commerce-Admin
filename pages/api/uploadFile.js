import multiparty from 'multiparty';

export default async function handle(req,res){
    const form = new multiparty.Form()
    const {fields, files} = await new Promise((resolve, reject)=>{
        form.parse(req, (err, fields, files)=>{

            if (err) reject(err);
            resolve({fields, files})
            
        });
    });
    console.log("length of file: ", files.file.length )
    
    res.status(200).json('ok')
}

export const config = {
    api: {bodyParser: false},
};