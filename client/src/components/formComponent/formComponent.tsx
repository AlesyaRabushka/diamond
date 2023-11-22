import { FC, useEffect, useRef, useState } from "react";
import { ClientService } from "../../service/client.service";
import "./formComponent.css";
import {dataURItoBlob, setNewColor} from "../../helpers/helpers"
import fileDownload from "js-file-download"

import { RiseLoader } from "react-spinners";

export const FormComponent:FC = () => {

    // uploaded image
    const [image, setImage] = useState<File | undefined>(undefined);
    const [imageDataUrl, setImageDataUrl] = useState<string>('');

    // DRAG & DROP
    const [drag, setDrag] = useState(false);
    const [dragText, setDragText] = useState('Перенесите картинку сюда или нажмите на кнопку')

    

    // pixelationFactor
    const [pixelRange, setPixelRange] = useState(0);
    // color amount
    const [colorAmountValue, setColorAmountValue] = useState('Выбрать количество цветов');
    // img size parameters
    const [size, setSize] = useState({width: 0, height:0});


    // check if image has been pixelated
    const [isPixelated, setIsPixelated] = useState(false)
    // check if image has been modified
    const [modified, setModified] = useState(false);
    // check if image colors have been changed
    const [colorChange, setColorChange] = useState(false);
    // check if spinner is needed
    const [spinner, setSpinner] = useState(false);
    // check when start processing
    const [start, setStart] = useState(false);


    //drop down
    const dropDownValues = [6, 12, 18];
    const [show, setShow] = useState(false);

    


    useEffect(() => {
        if (image){
            const reader = new FileReader();

            reader.addEventListener("load", () => {
                setImageDataUrl(reader.result as string);
            });

            reader.readAsDataURL(image);
        }
    }, [image])

    // upload image from file system
    const handleImageUpload = (e:any) => {
        const file = e.target.files[0];
        console.log(file.size)
        if (file.size < 10000000){
            setImage(file);
        } else {
            setDragText('Слишком большой размер изображения')
        }
        
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
            setIsPixelated(true);
        }
    };

   
    // click to show drop down items
    const dropDownClick = () => {
        setShow(!show);
   }

    // change clicked color to the given one
    const handleColorChange = async () => {
        if (image){
            setSpinner(true);
            setStart(true);
            setColorChange(false);
            
            const result = await ClientService.colorChangeV3(image, Number(pixelRange), Number(colorAmountValue));

            setSpinner(false)
            // setAlreadyChanged(changedArray);

            const imgBlob = dataURItoBlob(result);
            setImage(new File([imgBlob], 'diamond.png'));
            
            // setColors(await setNewColor(colors, color, newColor));
            setColorChange(true);
        }
    }

    // download image
    const handleDownload = async() => {
        if (image){
            fileDownload(image, `${image.name}`)
        }
    }

    const hadleNewImage = () => {
        // no image
        setImage(undefined);
        setImageDataUrl('');
        // no pixel range value
        setPixelRange(0);
        // no image modification 
        setModified(false)
        // no pixelation has been done
        setIsPixelated(false);
        // no color amount
        setColorAmountValue('Выбрать количество цветов')
        // no start processing
        setStart(false);
        // no color change
        setColorChange(false);
        // drag area text
        setDragText('Перенесите картинку сюда или нажмите на кнопку')
    }


   



    return (
        <div className="layout">
        <div className="form">
            
            {/* ----- DRAG & DROP area */}
            {!image && 
                <>
                {drag ?
                        <div className="drag-area"
                            onDragStart={e => {
                                e.preventDefault();
                                setDrag(true);
                            }}
                            onDragLeave={e => {
                                e.preventDefault();
                                setDrag(false);
                                setDragText('Перенесите картинку сюда или нажмите на кнопку')
                            }}
                            onDragOver={e => {
                                e.preventDefault();
                                setDrag(true);
                                setDragText('Отпустите картинку')
                            }}
                            onDrop={e => {
                                e.preventDefault();
                                let file = e.dataTransfer.files[0];
                                if (file.type == 'image/png' || file.type == 'image/jpg' || file.type == 'image/jpeg'){
                                    console.log(file.size)
                                    if (file.size <= 10000000){
                                        
                                        setImage(file)
                                        setDrag(false);
                                    } else{
                                        setDrag(false);
                                        setDragText('Слишком большой размер изображения')
                                    }
                                } else {
                                    setDragText('Выберите картинку формата .png или .jpg')
                                    setDrag(false)
                                } 
                            }}
                        >
                            {dragText}
            
                        </div>
                    : <div className="drag-area"
                            onDragStart={e => {
                                e.preventDefault();
                                setDrag(true);
                            }}
                            onDragLeave={e => {
                                e.preventDefault();
                                setDrag(false)
                                setDragText('Перенесите сюда картинку или нажмите на кнопку')
                            }}
                            onDragOver={e => {
                                e.preventDefault();
                                setDrag(true);
                                setDragText('Отпустите картинку')
                            }}
                            >
                            {dragText}
                            <div className="input-box">
                                <label htmlFor="input-file" className="input-file-button">Выбрать файл</label>
                                <input type="file" name="file" id="input-file" className="input" onChange={handleImageUpload} accept="image/png, image/jpg, image/jpeg" />
                            </div>
                        </div>
                }
                </>
            }

            <img src={imageDataUrl} className="uploaded-img"/>
            

             {/* ----- FIRST STEP => when image UPLOADED */}
            {image &&
            
                <div className="uploaded-image-content">
                    {!isPixelated &&
                        <>
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
                        </>
                    }

                    {/* ----- SECOND STEP => when image modified */}
                    {modified &&
                        <>
                        <label className="img-size-label">{size.width}x{size.height}</label>

                        {!start && <>
                            <div className="drop-down">
                                <button className="input-file-button-dropdown" onClick={dropDownClick}>{colorAmountValue}</button>

                                {show && (
                                    <div className="color-amount-list">
                                        {dropDownValues
                                        .map(item => 
                                            <div className="color-amount-item" onClick={e => {
                                                setColorAmountValue(String(item));
                                                setShow(!show);
                                            }}>
                                                {item}
                                            </div>
                                        )}
                                    </div>
                                )
                                        
                                }
                            </div>
                        </>}

                        {/* ----- THIRD STEP => when set colors amount */}
                        {colorAmountValue != 'Выбрать' &&
                        
                            <>
                            {/* <button type="button" className="input-file-button" onClick={handleVerifyColors}>Выбрать цвета</button> */}
        
                            {/* <div className="image-colors-pallete">
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
                            </div> */}

                            
                            {
                                !start && <button type="button" className="input-file-button" onClick={handleColorChange}>Изменить</button>
                            }
                            
                            
                            
                            {/* {showPallete && 
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
                            } */}

                            {/* ----- LAST STEP => when colors have been changed */}
                            {colorChange ?
                                <>
                                    <label style={{fontSize:20, fontFamily:"-moz-initial", color:"white"}}>Изменения успешно применены!</label>
                                    <button type="button" className="input-file-button" onClick={handleDownload}>Скачать</button>
                                    <button type="button" className="input-file-button" onClick={hadleNewImage}>Загрузить новую картинку</button>
                                </>
                                :
                                <>
                                {
                                    spinner ? <RiseLoader className="spinner" color="rgba(30, 84, 206, 1)"/> : <></>
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