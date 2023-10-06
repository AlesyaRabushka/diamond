import { FC, useState } from "react";
import "./formComponent.css"


export const FormComponent:FC = () => {

    const [image, setImage] = useState('');
    const [imageName, setImageName] = useState('');
    const [pixelRange, setPixelRange] = useState('');
    const [idImg, setIdImg] = useState();

    const handleImage = (e:any) => {
        setImage(e.target.files[0])
        setImageName(e.target.files[0].name)
    }

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('img', image);
    }


    return (
        <div className="form">
            <div className="input-box">
            <input type="file" id="input-file" className="input" onChange={handleImage}/>
            <label htmlFor="input-file" className="input-file-button">Выбрать файл</label>
            <label className="input-file-name">{imageName}</label>
            <button type="button" className="input-file-button"
                onClick={handleSubmit}
                >Загрузить</button>
            </div>
            
            <img src="" id={idImg}></img>
            <input type="range"
                min={0}
                max={10}
                value={pixelRange}
                step={1}
                className="pixelation"
                onChange={e => 
                    setPixelRange(e.target.value)
                }
            />
            <label>{pixelRange}</label>
        </div>
    )
}