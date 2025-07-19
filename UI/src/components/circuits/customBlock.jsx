import React, { useState } from "react";
import { Position, useReactFlow } from "@xyflow/react";
import CustomHandle from "../codeComponents/CustomHandle.jsx";
import { useRotatedNode } from "../hooks/useRotatedNode.jsx";

function CustomCircuitNode({ id, data, isConnectable }) {
  const { setNodes, setEdges } = useReactFlow();
  const [expanded, setExpanded] = useState(false);
  const rotation = data.rotation || 0;

  const { getHandlePosition, RotatedNodeWrapper } = useRotatedNode(
    id,
    rotation,
    120,
    80,
  );

  // Обработчик двойного клика для развертывания схемы
  const handleDoubleClick = () => {
    if (!data.originalSchema) return;

    // Рассчитываем позицию для новых узлов
    const position = {
      x: data.position.x + 150,
      y: data.position.y,
    };

    // Создаем узлы из схемы с новыми позициями
    const newNodes = data.originalSchema.nodes.map((node) => ({
      ...node,
      position: {
        x: node.position.x + position.x,
        y: node.position.y + position.y,
      },
      selected: false,
      zIndex: 1000,
    }));

    // Создаем соединения
    const newEdges = [...data.originalSchema.edges];

    // Добавляем новые элементы в редактор
    setNodes((prev) => [...prev, ...newNodes]);
    setEdges((prev) => [...prev, ...newEdges]);

    // Удаляем кастомный узел
    setNodes((prev) => prev.filter((node) => node.id !== id));
  };

  // Обработчик клика по узлу
  const handleNodeClick = (e) => {
    if (e.detail === 2) {
      handleDoubleClick();
    }
  };

  return (
    <RotatedNodeWrapper
      className="custom-circuit-node"
      onClick={handleNodeClick}
    >
      <div className="node-header">
        <div className="node-icon">⚡</div>
        <div className="node-label">{data.label || "Custom Circuit"}</div>
      </div>

      <div className="ports-container">
        {/* Входные порты */}
        <div className="input-ports">
          {data.inputs?.map((input, index) => (
            <div key={`input-${input.id}`} className="port-group">
              <CustomHandle
                type="target"
                position={getHandlePosition(Position.Left)}
                id={`input-${input.id}`}
                style={{
                  top: `${20 + index * 20}px`,
                  left: -5,
                }}
                isConnectable={isConnectable}
              />
              <span className="port-label">{input.name}</span>
            </div>
          ))}
        </div>

        {/* Выходные порты */}
        <div className="output-ports">
          {data.outputs?.map((output, index) => (
            <div key={`output-${output.id}`} className="port-group">
              <span className="port-label">{output.name}</span>
              <CustomHandle
                type="source"
                position={getHandlePosition(Position.Right)}
                id={`output-${output.id}`}
                style={{
                  top: `${20 + index * 20}px`,
                  right: -5,
                }}
                isConnectable={isConnectable}
              />
            </div>
          ))}
        </div>
      </div>

      {expanded && (
        <div className="expanded-view">
          {/* Здесь можно отобразить миниатюру схемы */}
        </div>
      )}
    </RotatedNodeWrapper>
  );
}

export default CustomCircuitNode;
