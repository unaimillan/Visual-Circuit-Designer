import React, { createContext, useState, useContext, useEffect } from 'react';
import { IconCloseCross } from "../../../../assets/ui-icons.jsx";
import {LOG_LEVELS, showToast, showToastError} from "../../codeComponents/logger.jsx";

// Контекст для управления кастомными блоками
const CustomBlocksContext = createContext();

export const CustomBlocksProvider = ({ children }) => {
  const [customBlocks, setCustomBlocks] = useState([]);

  // Загрузка блоков из localStorage при инициализации
  useEffect(() => {
    const blocks = JSON.parse(localStorage.getItem('customBlocks') || '[]');
    setCustomBlocks(blocks);
  }, []);

  // Сохранение блоков в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('customBlocks', JSON.stringify(customBlocks));
  }, [customBlocks]);

  // Добавление нового блока
  const addBlock = (block) => {
    setCustomBlocks(prev => [...prev, block]);
  };

  // Удаление блока
  const deleteBlock = (blockId) => {
    setCustomBlocks(prev => prev.filter(block => block.id !== blockId));
  };

  return (
      <CustomBlocksContext.Provider value={{
        customBlocks,
        addBlock,
        deleteBlock
      }}>
        {children}
      </CustomBlocksContext.Provider>
  );
};

export const useCustomBlocks = () => useContext(CustomBlocksContext);

// Компонент для создания кастомных блоков
export default function CreateCustomBlock({ nodes, edges }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blockName, setBlockName] = useState("");
  const [error, setError] = useState("");
  const { addBlock } = useCustomBlocks();

  const handleCreateFromCurrent = () => {
    if (!blockName.trim()) {
      showToastError("Please enter a custom block name.");
      return;
    }

    try {
      // Создаем кастомный блок
      const customBlock = {
        id: `custom_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 10)}`,
        name: blockName.trim(),
        inputs: nodes.filter(node =>
            node.type === "inputNodeSwitch" || node.type === "inputNodeButton"
        ).map(node => ({
          id: node.id,
          name: node.name || `input_${node.id.slice(0, 4)}`
        })),
        outputs: nodes.filter(node =>
            node.type === "outputNodeLed"
        ).map(node => ({
          id: node.id,
          name: node.name || `output_${node.id.slice(0, 4)}`
        })),
        originalSchema: { nodes, edges }
      };

      addBlock(customBlock);

      setBlockName("");
      setError("");
      setIsModalOpen(false);

      showToast(`Block "${blockName}" created successfully!`, '✅', LOG_LEVELS.ERROR);
    } catch (err) {
      console.error("Block creation error:", err);
      setError(`Error: ${err.message}`);
    }
  };

  return (
      <div className="create-custom-block">
        <button className="create-button" onClick={() => setIsModalOpen(true)}>
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
                  <IconCloseCross SVGClassName={"close-custom-circuit-cross"} />
                </button>

                <div className="creation-options">
                  <button className="option-button">
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