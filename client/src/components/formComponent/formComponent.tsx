import { FC, useEffect, useState } from "react";
import { ClientService } from "../../service/client.service";
import "./formComponent.css";
import { DropDownComponent } from "../dropDownComponent/dropDownComponent";
import {dataURItoBlob} from "../../helpers/helpers"
import fileDownload from "js-file-download"


export const FormComponent:FC = () => {
    // colors
    const mainColors = [[0, 255, 255], [0, 128, 255], [0, 0, 255], [128, 0, 255], [255, 0, 255], [255, 0, 128],
                        [255, 0, 0], [255, 128, 0], [255, 255, 0], [128, 255, 0], [0, 255, 0], [0, 255, 128]]

    // uploaded image
    const [image, setImage] = useState<File | undefined>(undefined);
    const [imageDataUrl, setImageDataUrl] = useState<string>('');

    const [drag, setDrag] = useState(false);

    useEffect(() => {
        if (image){
            const reader = new FileReader();

            reader.addEventListener("load", () => {
                setImageDataUrl(reader.result as string);
            });

            reader.readAsDataURL(image);
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
    const [alreadyChanged, setAlreadyChanged] = useState<any>([]);

    // upload image from file system
    const handleImageUpload = (e:any) => {
        const file = e.target.files[0];
        setImage(file);
    }

    // request to modify image
    const handleModify = async () => {
        if (image){
            const {data, height, width} = await ClientService.modifyImgV2(image, Number(pixelRange));
            // console.log('modified img', imgDataObject);
            setSize({width:width, height:height})
            const imgBlob = dataURItoBlob(data);
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
    const handleColorChange = async (color:Array<number>, newColor: Array<number>) => {
        if (image){
            console.log('in color change');
            console.log('changed')
            console.log(alreadyChanged)

            const {result, changedArray} = await ClientService.colorChangeV2(image, Number(pixelRange), color, newColor, colors, mainColors);
            // setNewColorsImg(imgData);
            setAlreadyChanged(changedArray);
            const imgBlob = dataURItoBlob(result);
            // console.log(imgBlob)
            setImage(new File([imgBlob], 'diamond.png'));
            // console.log('new color', newColor   )
            // console.log('colors used',alreadyChanged)
            // usedColors.push(newColor);
            // let arr = [];
            // for (let i = 0; i < usedColors.length; i++){
            //     arr.push(usedColors[i])
            // }
            // arr.push(newColor)
            // console.log('used: ',arr);
            // setAlreadyChanged(arr);
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
            
            
            {drag ?
                    <div className="drag-area"
                        onDragStart={e => {
                            e.preventDefault();
                            setDrag(true);
                        }}
                        onDragLeave={e => {
                            e.preventDefault();
                            setDrag(false)
                        }}
                        onDragOver={e => {
                            e.preventDefault();
                            setDrag(true);
                        }}
                        onDrop={e => {
                            e.preventDefault();
                            let file = e.dataTransfer.files[0];
                            setImage(file)
                            setDrag(false);
                        }}
                    >
                        Отпустите картинку
          
                    </div>
                : <div className="drag-area"
                        onDragStart={e => {
                            e.preventDefault();
                            setDrag(true);
                        }}
                        onDragLeave={e => {
                            e.preventDefault();
                            setDrag(false)
                        }}
                        onDragOver={e => {
                            e.preventDefault();
                            setDrag(true);
                        }}
                        >
                        Перетащите картинку сюда или нажмите на кнопку
                        <div className="input-box">
                            <label htmlFor="input-file" className="input-file-button">Выбрать файл</label>
                            <input type="file" name="file" id="input-file" className="input" onChange={handleImageUpload}/>
                        </div>
                    </div>
            }

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


            <div className="image-colors-pallete">
                <div className="grid-container">
                    {colors.map((color:[number, number, number]) => 
                    <div className="color" onClick={e => {
                            setShowPallete(!showPallete); 
                            setChangedColor(color); 
                            // handleColorChange(color, [255, 128, 75])
                        }} 
                        style={{
                        backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`
                        }} >

                        <span className="tooltip">Заменить цвет</span>
                    </div>)}                    
                </div>
            </div>

            {showPallete && 
                    <div className="color-pallete">
                        <div className="grid-container">
                            {mainColors.map(newColor => 
                                <div className="color" onClick={e => {
                                    handleColorChange(changedColor, newColor);
                                    setShowPallete(!showPallete);
                                }}
                                style={{
                                    backgroundColor: `rgb(${newColor[0]}, ${newColor[1]}, ${newColor[2]})`
                                }}>
                                    
                                </div>
                            )}
                        </div>
                        </div>
                }
            {/* <img src={newColorsImg} className="uploaded-img"/> */}

            
            <button type="button" className="input-file-button" onClick={handleDownload}>Скачать</button>

        </div>
        </div>
    )
}