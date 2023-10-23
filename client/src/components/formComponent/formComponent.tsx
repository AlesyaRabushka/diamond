import { FC, useEffect, useState } from "react";
import { ClientService } from "../../service/client.service";
import "./formComponent.css";
import { DropDownComponent } from "../dropDownComponent/dropDownComponent";
import {dataURItoBlob, setNewColor} from "../../helpers/helpers"
import fileDownload from "js-file-download"

import { RiseLoader } from "react-spinners";

export const FormComponent:FC = () => {
    // colors
    const mainColors = [[ 250, 132, 43], [237, 171, 86], [ 209, 91, 143], [171, 37, 36], [0, 187, 46], [52, 129, 184],
                        [41, 44, 47], [111, 74, 47], [245, 255, 0], [247, 249, 239], [16, 44, 84], [198, 54, 120],
                    [39, 98, 53], [141, 29, 44], [144, 70, 132], [127, 176, 178], [250, 171, 33]]

    // uploaded image
    const [image, setImage] = useState<File | undefined>(undefined);
    const [imageDataUrl, setImageDataUrl] = useState<string>('');

    // DRAG & DROP
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

    // pixelationFactor
    const [pixelRange, setPixelRange] = useState(0);
    // color amount
    const [value, setValue] = useState('');
    // img size parameters
    const [size, setSize] = useState({width: 0, height:0});

    // color change
    const [showPallete, setShowPallete] = useState(false);
    const [changedColor, setChangedColor] = useState([0, 0, 0]);

    // check if image colors array is setted
    const [showColors, setShowColors] = useState(false);
    // image colors array
    const [colors, setColors] = useState<any>([]);
    const [alreadyChanged, setAlreadyChanged] = useState<any>([]);

    // check if image has been modified
    const [modified, setModified] = useState(false);
    // check if image colors have been changed
    const [colorChange, setColorChange] = useState(false);
    // check if spinner is needed
    const [spinner, setSpinner] = useState(false);




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
            setImage(new File([imgBlob], 'diamond.png'));
            setModified(true);
        }
    };

    // return color pallete of image
    const handleVerifyColors = async () => {
        if (image){
            console.log('here')
            const data = await ClientService.verifyColorsV2(image, Number(value));
            
            setColors(() => data);
        }
    };

    // change clicked color to the given one
    const handleColorChange = async (color:Array<number>, newColor: Array<number>) => {
        if (image){
            setSpinner(true);
            setColorChange(false);
            const {result, changedArray} = await ClientService.colorChangeV2(image, Number(pixelRange), color, newColor, colors, mainColors);
            setSpinner(false)
            setAlreadyChanged(changedArray);

            const imgBlob = dataURItoBlob(result);
            setImage(new File([imgBlob], 'diamond.png'));
            
            setColors(await setNewColor(colors, color, newColor));
            setColorChange(true);
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
            
            {/* ----- DRAG & DROP area */}
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
                        Перенесите картинку сюда или нажмите на кнопку
                        <div className="input-box">
                            <label htmlFor="input-file" className="input-file-button">Выбрать файл</label>
                            <input type="file" name="file" id="input-file" className="input" onChange={handleImageUpload}/>
                        </div>
                    </div>
            }

            <img src={imageDataUrl} className="uploaded-img"/>
            

             {/* ----- FIRST STEP => when image UPLOADED */}
            {image &&
            
              <div className="uploaded-image-content">
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

                    {/* ----- SECOND STEP => when image modified */}
                    {modified &&

                        <>
                        <label className="img-size-label">{size.width}x{size.height}</label>
                        <DropDownComponent setValue={setValue} value={value}/>

                        {/* ----- THIRD STEP => when set colors amount */}
                        {value != 'Выбрать' &&
                        
                            <>
                            <button type="button" className="input-file-button" onClick={handleVerifyColors}>Выбрать цвета</button>
        
                            <div className="image-colors-pallete">
                                <div className="grid-container">
                                    {colors.map((color:[number, number, number]) => 
                                    <div className="color" onClick={e => {
                                            setShowPallete(!showPallete); 
                                            setChangedColor(color); 
                                        }} 
                                        style={{
                                        backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`
                                        }} >
        
                                        <span className="tooltip">Заменить цвет</span>
                                    </div>)}                    
                                </div>
                            </div>
                        
                            
                            
                            {/* color pallete of needed colors */}
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
                                                <span className="tooltip">Выбрать цвет</span>
                                            </div>
                                        )}
                                    </div>
                                    </div>
                            }

                            {/* ----- LAST STEP => when colors have been changed */}
                            {colorChange ?
                                <>
                                    <label style={{fontSize:20, fontFamily:"-moz-initial", color:"white"}}>Изменения успешно применены!</label>
                                    <button type="button" className="input-file-button" onClick={handleDownload}>Скачать</button>
                                    
                                </>
                                :
                                <>
                                {
                                    spinner ? <RiseLoader color="rgba(30, 84, 206, 1)"/> : <></>
                                }
                                </>
                            }
                            </>
                        }

                        </>
                    }
                </div>
            
            }

        </div>
        </div>
    )
}