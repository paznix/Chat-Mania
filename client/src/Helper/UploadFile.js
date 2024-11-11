
const url = `https://api.cloudinary.com/v1_1/maniapaznic/image/upload`



export const UploadFile = async(file)=>{
    const formData = new FormData()
    formData.append('file',file)
    formData.append("upload_preset","chatmania")

    const response = await fetch(url,{
        method : 'post',
        body : formData
    })
    const responseData = await response.json()


    return responseData
}
