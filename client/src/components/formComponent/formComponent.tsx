import { FC, useEffect, useState } from "react";
import { ClientService } from "../../service/client.service";
import "./formComponent.css";
import { DropDownComponent } from "../dropDownComponent/dropDownComponent";

export const FormComponent:FC = () => {

    const [image, setImage] = useState('');
    const [imageName, setImageName] = useState('');


    const [imgSystemName, setImgSystemName] = useState();
    const [imgModifiedImgSystemName, setModifiedImgSystemName] = useState('');

    const [pixelRange, setPixelRange] = useState(0);

    const [img, setImg] = useState();
    const [modifiedImg, setModifiedImg] = useState('');

    const [value, setValue] = useState('Выбрать');

    const [size, setSize] = useState({width: 0, height:0});

    // const [colors, setColors] = useState<any[]>([]);
    const [colors, setColors] = useState<any>([]);
    // const colors:Array<any[]> = [];

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
    const getModifiedImg = async (imgName:string) =>{
        console.log('get modified start',imgName )
        const imgObject = await ClientService.returnModifiedImg(imgName);

        setSize({width: imgObject.width / pixelRange, height: imgObject.height / pixelRange});
        console.log(size);
        setModifiedImg(String(imgObject.newImgData));
        return imgObject;
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
        const imgObject = await ClientService.modifyImg(String(imgSystemName), Number(pixelRange));
        console.log('modified img name', imgObject);
        setModifiedImgSystemName(imgObject);

        // rewuest to show modified image
        await getModifiedImg(String(imgObject));
    };

    const handleVerifyColors = async () => {
        console.log('name',imgModifiedImgSystemName);
        console.log(value);
        const data = await ClientService.verifyColors(imgModifiedImgSystemName, Number(value));
        console.log('data', data)
        setColors(() => data);
    };

    return (
        <div className="layout">
        <div className="form">
            <div className="input-box">
                <label htmlFor="input-file" className="input-file-button">Выбрать файл</label>
                <input type="file" name="file" id="input-file" className="input" onChange={handleImage}/>
                <label className="input-file-name">{imageName}</label>
                
            </div>

            {/* <div className="button-box"> */}
                <button type="button"
                    className="input-file-button"
                    onClick={handleUpload}>
                        Загрузить
                </button>
            {/* </div> */}
            
            <img src={img} className="uploaded-img"/>
            
            <input type="range"
                min={0}
                max={100}
                value={pixelRange}
                step={1}
                className="pixelation"
                onChange={e => 
                    setPixelRange(Number(e.target.value))
                }
            />
            <label className="pixelation-label">{pixelRange}</label>

            <button type="button" className="input-file-button" onClick={handleModify}>Изменить</button>
           

            <img src={modifiedImg} className="uploaded-img"/>

            {imgModifiedImgSystemName && <label className="img-size-label">{size.width}x{size.height}</label>}


            <DropDownComponent setValue={setValue} value={value}/>

            <button type="button" className="input-file-button" onClick={handleVerifyColors}>Выбрать цвета</button>


            {colors.map((color:[number, number, number]) => <div className="color" style={{
                backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`
            }} ></div>)}

        </div>
        </div>
    )
}