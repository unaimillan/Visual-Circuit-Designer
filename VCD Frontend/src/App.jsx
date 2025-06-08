import {useState} from 'react'
import './App.css'

function App() {
    let activeButton, isButtonActive;
    const [panelState, setPanelState] = useState(false)
    const [isBasicVisible, setIsBasicVisible] = useState(true);
    isButtonActive = false;
    activeButton = "mouse";
    //Обычная мышка - mouse
    //рука для drag - hand
    //провод по сетке - squareWire
    //провод по диаг - diagWire
    // Ластик - eraser

    const [openIndexes, setOpenIndexes] = useState([]);
    const menuItems = [
        {
            question: "1. Basic Logic Elements",
            answer: [<img className={'buttonPicture'} src="../public/assets/Circuits%20Menu/AND.svg" alt={"and"}/>,
                <img className={'buttonPicture'} src="../public/assets/Circuits%20Menu/OR.svg" alt={"or"}/>,
                <img className={'buttonPicture'} src="../public/assets/Circuits%20Menu/NOT.svg" alt={"not"}/>,
                <img className={'buttonPicture'} src="../public/assets/Circuits%20Menu/NAND.svg" alt={"nand"}/>]
        },
        {
            question: "2. Advanced Logic Elements",
            answer: [<img className={'buttonPicture'} src="../public/assets/Circuits%20Menu/OR.svg" alt={"or"}/>]
        },
        {
            question: "3. Pins",
            answer: [<img className={'buttonPicture'} src="../public/assets/Circuits%20Menu/NOT.svg" alt={"not"}/>]
        },
        {
            question: "4. Custom Logic Elements",
            answer: [<img className={'buttonPicture'} src="../public/assets/Circuits%20Menu/NAND.svg" alt={"nand"}/>]
        }
    ];

    const toggleItem = (index) => {
        setOpenIndexes(prevIndexes => {
            if (prevIndexes.includes(index)) {
                // Если индекс уже есть в массиве - удаляем
                return prevIndexes.filter(i => i !== index);
            } else {
                // Если нет - добавляем
                return [...prevIndexes, index];
            }
        });
    };

    return (
        <div>
            <button className="openMenuButton" onClick={() => setPanelState(!panelState)}>
                <img className={"openMenuButtonIcon"} src="/assets/Circuits%20Menu/menu.svg" alt="open/close menu"/>
            </button>

            <div className={`panel ${panelState ? 'open' : ''}`}>

                <div className="menu-container">
                    <div className="menu-header">
                        <p className={"panelText"}>
                            Menu
                        </p>
                        <div className="divider"></div>
                    </div>

                    <ul className="menu-items">
                        {menuItems.map((item, index) => (
                            <li
                                key={index}
                                className={`menu-item ${openIndexes.includes(index) ? 'active' : ''}`}
                                onClick={() => toggleItem(index)}
                            >
                                <div className="question">
                                    {item.question}
                                    <span className="arrow">{openIndexes.includes(index) ? '▲' : '▼'}</span>
                                </div>

                                {openIndexes.includes(index) && (

                                    <ul>
                                        {item.answer}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className={"toolbar"}>
                <button className={`toolbarButton ${isButtonActive ? 'activeButton' : ''}`}>
                    <img src="/assets/toolBar/cursor.svg" alt="cursor" className={"toolbarButtonIcon"}/>
                </button>

                <button className={`toolbarButton ${isButtonActive ? 'activeButton' : ''}`}>
                    <img src="/assets/toolBar/hand.svg" alt="hand" className={"toolbarButtonIcon"}/>
                </button>

                <button className={`toolbarButton ${isButtonActive ? 'activeButton' : ''}`}>
                    <img src="/assets/toolBar/line.svg" alt="square wire" className={"toolbarButtonIcon"}/>
                </button>

                <button className={`toolbarButton ${isButtonActive ? 'activeButton' : ''}`}>
                    <img src="/assets/toolBar/line2.svg" alt="diagonal wire" className={"toolbarButtonIcon"}/>
                </button>

                <button className={`toolbarButton ${isButtonActive ? 'activeButton' : ''}`}>
                    <img src="/assets/toolBar/eraser.svg" alt="eraser" className={"toolbarButtonIcon"}/>
                </button>

                <button className={`toolbarButton ${isButtonActive ? 'activeButton' : ''}`}>
                    <img src="/assets/toolBar/text.svg" alt="text tool" className={"toolbarButtonIcon"}/>
                </button>
            </div>


        </div>
    )
}

export default App
