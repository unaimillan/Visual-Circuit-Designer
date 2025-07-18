import React, { useState } from 'react';
import {IconCloseCross} from "../../../../assets/ui-icons.jsx";
import toast from "react-hot-toast";
import {showToastError} from "../../codeComponents/logger.jsx";


export default function CreateCustomBlock({
                                              nodes,
                                              edges,
                                              onCreateFromFile, // Колбэк при создании из файла (вы реализуете)
                                              onCreateFromCurrent // Колбэк при создании из схемы (вы реализуете)
                                          }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [blockName, setBlockName] = useState('');
    const [error, setError] = useState('');

    const handleCreateFromCurrent = () => {
        if (!blockName.trim()) {
            showToastError("Please enter a custom block name.")
            return;
        }

        try {
            // Создаем кастомный блок из текущей схемы
            const customBlock = createCustomBlock(nodes, edges, blockName.trim());

            // Сохраняем в localStorage
            saveCustomBlock(customBlock);

            // Сбрасываем состояние
            setBlockName('');
            setError('');
            setIsModalOpen(false);

            // Вызываем колбэк (если нужна дополнительная логика)
            if (onCreateFromCurrent) {
                onCreateFromCurrent(customBlock);
            }

            alert(`Блок "${blockName}" успешно создан!`);
        } catch (err) {
            console.error('Ошибка при создании блока:', err);
            setError(`Ошибка: ${err.message}`);
        }
    };

    const handleCreateFromFile = () => {
        setIsModalOpen(false);
        if (onCreateFromFile) {
            onCreateFromFile();
        }
    };

    return (
        <div className="create-custom-block">

            <button
                className="create-button"
                onClick={() => setIsModalOpen(true)}
            >
                Add custom circuit
            </button>

            {isModalOpen && (
                <div className="custom-block-modal">
                    <div className="modal-content">
                        <h3>Create custom block</h3>

                        <button
                            className="close-button-custom-circuit"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <IconCloseCross SVGClassName={"close-custom-circuit-cross"}/>
                        </button>



                        <div className="creation-options">
                            <button
                                className="option-button"
                                onClick={handleCreateFromFile}
                            >
                                From file
                            </button>

                            <div className="current-circuit-option">
                                <button
                                    className="option-button"
                                    onClick={handleCreateFromCurrent}
                                >
                                    From current circuit
                                </button>

                                <div className="name-input">
                                    <input
                                        type="text"
                                        value={blockName}
                                        onChange={(e) => setBlockName(e.target.value)}
                                        placeholder="New custom block name"
                                        required
                                    />
                                    {error && <p className="error-message">{error}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}







const generateCustomBlockId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    return `custom_${timestamp}_${random}`;
};


export const createCustomBlock = (nodes, edges, blockName) => {
    // Валидация входных данных
    if (!Array.isArray(nodes)) {
        throw new Error('Invalid nodes: must be an array');
    }

    if (!Array.isArray(edges)) {
        throw new Error('Invalid edges: must be an array');
    }

    // Фильтрация входных нод
    const inputs = nodes.reduce((acc, node) => {
        if (node.type === 'inputNodeSwitch' || node.type === 'inputNodeButton') {
            acc.push({
                id: node.id,
                name: node.name || `input_${Math.floor(Math.random() * 10000)}` // Случайный номер
            });
        }
        return acc;
    }, []);

    // Фильтрация выходных нод
    const outputs = nodes.reduce((acc, node) => {
        if (node.type === 'outputNodeLed') {
            acc.push({
                id: node.id,
                name: node.name || `output_${Math.floor(Math.random() * 10000)}` // Случайный номер
            });
        }
        return acc;
    }, []);

    return {
        id: generateCustomBlockId(),
        name: blockName,
        inputs,
        outputs,
        originalSchema: { nodes, edges } // Сохраняем полную схему
    };
};

/**
 * Сохраняет кастомный блок в localStorage
 */
export const saveCustomBlock = (customBlock) => {
    try {
        const savedBlocks = JSON.parse(localStorage.getItem('customBlocks') || '[]');
        const updatedBlocks = [...savedBlocks, customBlock];
        localStorage.setItem('customBlocks', JSON.stringify(updatedBlocks));
    } catch (error) {
        console.error('Failed to save custom block:', error);
    }
};

/**
 * Загружает все кастомные блоки из localStorage
 */
export const loadCustomBlocks = () => {
    try {
        return JSON.parse(localStorage.getItem('customBlocks') || '[]');
    } catch (error) {
        console.error('Failed to load custom blocks:', error);
        return [];
    }
};

/**
 * Удаляет кастомный блок по ID
 */
export const deleteCustomBlock = (blockId) => {
    try {
        const savedBlocks = JSON.parse(localStorage.getItem('customBlocks') || '[]');
        const updatedBlocks = savedBlocks.filter(block => block.id !== blockId);
        localStorage.setItem('customBlocks', JSON.stringify(updatedBlocks));
        return true;
    } catch (error) {
        console.error('Failed to delete custom block:', error);
        return false;
    }
};

/**
 * Находит кастомный блок по ID
 */
export const findCustomBlockById = (blockId) => {
    const blocks = loadCustomBlocks();
    return blocks.find(block => block.id === blockId);
};