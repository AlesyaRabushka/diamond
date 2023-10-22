import { useRef, useState } from "react";
import './dropDownComponent.css'
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import { setSyntheticLeadingComments } from "typescript";

export const DropDownComponent = ({setValue, value}:{setValue:any, value: string}) => {
    const arr = [4, 6, 12, 18, 24];
    const [show, setShow] = useState(false);
    // const [value, setValue] = useState('Выбрать');

    const click = () => {
        console.log('hehre', show)

        setShow(!show);
    }

    const change = (e: React.FormEvent<HTMLInputElement>) => {
        const regex = /^[0-9\b]+$/;
        console.log(e.currentTarget.value)

        if (e.currentTarget.value == "" || regex.test(e.currentTarget.value)){
            setValue(e.currentTarget.value);
            console.log(value)
        }
    }

    const activeRefDiv = useRef(null);
    const activeRefBut = useRef(null);

    // window.addEventListener('click',(e) =>{
    //     if (e.target !== activeRefDiv.current){
    //         setShow(false)
    //     }
    // })

    const dismiss = (event: React.FocusEvent<HTMLDivElement>) => {
        if(event.currentTarget === event.target){
            setShow(false);
        }
    }


    return (
        <div className="drop-down">
            {/* <button type="button" onClick={click} >{value}</button> */}
            <input className="input-file-button-dropdown" value={value} ref={activeRefDiv} placeholder="Количество цветов" onClick={click} onChange={change} onBlur={(e: React.FocusEvent<HTMLDivElement>):void=> dismiss(e)}/> 
            
                {/* {value} */}
                {/* <button ref={activeRefBut}  onClick={e => console.log('d')}><ArrowDropDownCircleIcon/></button> */}
            {/* </div> */}

            {show && (
                <div className="color-amount-list">
                    {arr.filter((item:number) =>

                    String(item).startsWith(value)
                    ) 
                    .map(item => 
                        <div className="color-amount-item" onClick={e => {
                            
                            setValue(String(item));
                            }}>
                            {item}
                        </div>
                    )}
                </div>
            )
                    
            }
        </div>
    )
}