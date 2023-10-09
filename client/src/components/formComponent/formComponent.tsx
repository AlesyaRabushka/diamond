import { FC, useEffect, useState } from "react";
import { ClientService } from "../../service/client.service";
import "./formComponent.css";

export const FormComponent:FC = () => {

    const [image, setImage] = useState('');
    const [imageName, setImageName] = useState('');


    const [imgSystemName, setImgSystemName] = useState();

    const [pixelRange, setPixelRange] = useState(0);

    const [img, setImg] = useState();
    const [modifiedImg, setModifiedImg] = useState();

    // upload image from file system
    const handleImage = (e:any) => {
        setImage(e.target.files[0])
        setImageName(e.target.files[0].name)
    }

    // get originall image from server
    const getImg = async () =>{
        const response = await ClientService.returnImg().then(data => setImg(data))
        return response;
    }
    // get modified image from server
    const getModifiedImg = async () =>{
        const response = await ClientService.returnModifiedImg().then(data => setModifiedImg(data))
        return response;
    }
    

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('image', image);
        // upload image to server
        await ClientService.uploadImg(formData).then(data => setImgSystemName(data));
        // get image back from server to show
        await getImg();
    }

    const handleModify = async () => {
        // request to modify image
        await ClientService.modifyImg(String(imgSystemName), 70);
        // rewuest to show modified image
        await getModifiedImg();
    }

    return (
        <div className="form">
            <div className="input-box">
            <input type="file" name="file" id="input-file" className="input" onChange={handleImage}/>
            <label htmlFor="input-file" className="input-file-button">Выбрать файл</label>
            <label className="input-file-name">{imageName}</label>
            <button type="button"
                className="input-file-button"
                onClick={handleUpload}>
                    Загрузить
            </button>
            </div>
            
            <img src={img} className="uploaded-img"/>
            
            <input type="range"
                min={0}
                max={10}
                value={pixelRange}
                step={1}
                className="pixelation"
                onChange={e => 
                    setPixelRange(Number(e.target.value))
                }
            />
            <label>{pixelRange}</label>


            <button type="button" className="input-file-button" onClick={(e) => {
                e.preventDefault();
                handleModify();
            }}>modify</button>

            <img src={modifiedImg} className="uploaded-img"/>
        </div>
    )
}