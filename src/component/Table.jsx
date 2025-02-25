import React, { useState } from "react";

const initialData = [
    {
        id: "electronics",
        label: "Electronics",
        value: 800 + 700,
        children: [
            { id: "phones", label: "Phones", value: 800 },
            { id: "laptops", label: "Laptops", value: 700 },
        ],
    },
    {
        id: "furniture",
        label: "Furniture",
        value: 300 + 700,
        children: [
            { id: "tables", label: "Tables", value: 300 },
            { id: "chairs", label: "Chairs", value: 700 },
        ],
    },
];
const calculateSubtotals = (data) => {
    return data.map((item) => {
        if (item.children) {
            const updatedChildren = calculateSubtotals(item.children);
            const subtotal = updatedChildren.reduce((sum, child) => sum + (child.value || 0), 0);
            return { ...item, value: subtotal, originalValue: subtotal, children: updatedChildren };
        }
        return { ...item, originalValue: item.value };
    });
};

const Table = () => {
    const [data, setData] = useState(calculateSubtotals(initialData));
    const [inputValues, setInputValues] = useState({});

    const updateValue = (id, newValue) => {
        const updateRows = (rows) => {
            return rows.map((row) => {
                if (row.id === id) {
                    
                    const updatedRow = { ...row, value: newValue };
                    if (row.children) {
                        const totalContribution = row.children.reduce((sum, child) => sum + child.originalValue, 0);
                        updatedRow.children = row.children.map((child) => {
                            const contributionPercentage = (child.originalValue / totalContribution) * 100;
                            const updatedChildValue = Math.round((contributionPercentage / 100) * newValue * 100) / 100;
                            return { ...child, value: updatedChildValue };
                        });
                    }
                    return updatedRow;
                }
                if (row.children) {
                    const updatedChildren = updateRows(row.children);
                    const subtotal = updatedChildren.reduce((sum, child) => sum + child.value, 0);
                    return { ...row, children: updatedChildren, value: subtotal };
                }
                return row;
            });
        };
        setData((prevData) => updateRows(prevData));
        setInputValues((prev) => ({ ...prev, [id]: "" }));
    };

    const handleInputChange = (id, value) => {
        setInputValues((prev) => ({ ...prev, [id]: value }));
    };

    const handleAllocationPercentage = (id) => {
        const percentage = Number(inputValues[id]);
        if (!isNaN(percentage) && inputValues[id] !== "") {
            const updateRows = (rows) => {
                return rows.map((row) => {
                    if (row.id === id) {
                        return { ...row, value: Math.round(row.value * (1 + percentage / 100)) };
                    }
                    if (row.children) {
                        const updatedChildren = updateRows(row.children);
                        const subtotal = updatedChildren.reduce((sum, child) => sum + child.value, 0);
                        return { ...row, children: updatedChildren, value: subtotal };
                    }
                    return row;
                });
            };
            setData((prevData) => updateRows(prevData));
            setInputValues((prev) => ({ ...prev, [id]: "" }));
        }
    };

    const renderRows = (rows, level = 0) => {
        return rows.map((row) => (
            <React.Fragment key={row.id}>
                <tr className="border-b">
                    <td className={`py-2 px-4 ${level > 0 ? "pl-8" : ""}`}>{row.label}</td>
                    <td className="py-2 px-4">{row.value}</td>
                    <td className="py-2 px-4">
                        <input
                            type="number"
                            className="border p-1 w-20"
                            placeholder="Enter Value"
                            value={inputValues[row.id] || ""}
                            onChange={(e) => handleInputChange(row.id, e.target.value)}
                        />
                    </td>
                    <td className="py-2 px-4 space-x-2">
                        {level == 0 ? "" : <button
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                            onClick={() => handleAllocationPercentage(row.id)}
                        >
                            Apply %
                        </button>}
                    </td><td>
                        <button
                            className="bg-green-500 text-white px-2 py-1 rounded"
                            onClick={() => updateValue(row.id, Number(inputValues[row.id]))}
                        >
                            Apply Value
                        </button>
                    </td>
                    <td className="py-2 px-4">
                        {row.originalValue !== undefined
                            ? `${(((row.value - row.originalValue) / row.originalValue) * 100).toFixed(2)}%`
                            : "-"}
                    </td>
                </tr>
                {row.children && renderRows(row.children, level + 1)}
            </React.Fragment>
        ));
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Hierarchical Table</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4 border">Label</th>
                        <th className="py-2 px-4 border">Value</th>
                        <th className="py-2 px-4 border">Input</th>
                        <th className="py-2 px-4 border">Allocation by %</th>
                        <th className="py-2 px-4 border">Allocation by Val</th>
                        <th className="py-2 px-4 border">Variance</th>
                    </tr>
                </thead>
                <tbody>{renderRows(data)}</tbody>
            </table>
        </div>
    );
};

export default Table;