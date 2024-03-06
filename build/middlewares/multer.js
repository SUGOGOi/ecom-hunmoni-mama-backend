import multer from "multer";
const upload = multer({ dest: "../../uploads" });
export const singleUpload = upload.single("photo");
