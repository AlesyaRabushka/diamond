import { FC, useEffect, useState } from "react";
import { ClientService } from "../../service/client.service";
import "./formComponent.css";
import { DropDownComponent } from "../dropDownComponent/dropDownComponent";
import {dataURItoBlob} from "../../helpers/helpers"
import fileDownload from "js-file-download"


export const FormComponent:FC = () => {

    // uploaded image
    const [image, setImage] = useState<File | undefined>(undefined);
    const [imageDataUrl, setImageDataUrl] = useState<string>('');

    useEffect(() => {
        if (image){
            const reader = new FileReader();

            reader.addEventListener("load", () => {
                setImageDataUrl(reader.result as string);
            });

            reader.readAsDataURL(image);
            console.log('changed')
        }
    }, [image])

    // const [imgModifiedImgSystemName, setModifiedImgSystemName] = useState('');

    const [pixelRange, setPixelRange] = useState(0);

    const [value, setValue] = useState('Выбрать');

    const [size, setSize] = useState({width: 0, height:0});

    // color change
    const [showPallete, setShowPallete] = useState(false);
    const [changedColor, setChangedColor] = useState([0, 0, 0]);

    
    const [colors, setColors] = useState<any>([]);
    const [newColorsImg, setNewColorsImg] = useState('');

    // upload image from file system
    const handleImageUpload = (e:any) => {
        const file = e.target.files[0];
        setImage(file);
    }

    // request to modify image
    const handleModify = async () => {
        if (image){
            const imgDataObject = await ClientService.modifyImgV2(image, Number(pixelRange));
            console.log('modified img', imgDataObject);

            const imgBlob = dataURItoBlob(imgDataObject);
            // console.log(imgBlob)
            setImage(new File([imgBlob], 'diamond.png'))
        }
    };

    // return color pallete of image
    const handleVerifyColors = async () => {
        if (image){
            const data = await ClientService.verifyColorsV2(image, Number(value));
            console.log('data', data)
            setColors(() => data);
        }
    };

    // change clicked color to the given one
    const handleColorChange = async (color: [number, number, number], newColor: [number, number, number]) => {
        if (image){
            console.log('in color change')
            const imgData = await ClientService.colorChangeV2(image, Number(pixelRange), color, newColor, colors);
            // setNewColorsImg(imgData);
            const imgBlob = dataURItoBlob(imgData);
            // console.log(imgBlob)
            setImage(new File([imgBlob], 'diamond.png'))
        }
    }

    // download image
    const handleDownload = async() => {
        if (image){
            fileDownload(image, `${image.name}`)
        }
    }

    return (
        <div className="layout">
        <div className="form">
            <div className="input-box">
                <label htmlFor="input-file" className="input-file-button">Выбрать файл</label>
                <input type="file" name="file" id="input-file" className="input" onChange={handleImageUpload}/>
                {/* <label className="input-file-name">{imageName}</label> */}
                
            </div>
            
            <img src={imageDataUrl} className="uploaded-img"/>
            
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


            {image && <label className="img-size-label">{size.width}x{size.height}</label>}


            <DropDownComponent setValue={setValue} value={value}/>

            <button type="button" className="input-file-button" onClick={handleVerifyColors}>Выбрать цвета</button>

            
            <div className="grid-container">
                {colors.map((color:[number, number, number]) => 
                <div className="color" onClick={e => {setShowPallete(!showPallete); 
                    setChangedColor(color); 
                    handleColorChange(color, [255, 128, 75])
                    }} style={{
                    backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`
                    }} >

                    <span className="tooltip">Заменить цвет</span>

                    
                </div>)}
                {showPallete && 
                        <div className="color-pallete">ofofof</div>
                    }
            </div>
            {/* <img src={newColorsImg} className="uploaded-img"/> */}

            
            <button type="button" className="input-file-button" onClick={handleDownload}>Скачать</button>

        </div>
        </div>
    )
}