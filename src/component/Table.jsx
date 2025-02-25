import React from "react";

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

const Table = () => {
  const renderRows = (rows, level = 0) => {
    return rows.map((row) => (
      <React.Fragment key={row.id}>
        <tr className="border-b">
          <td className={`py-2 px-4 ${level > 0 ? "pl-8" : ""}`}>{row.label}</td>
          <td className="py-2 px-4">{row.value}</td>
          {level === 0 ? (
            <td className="py-2 px-4"></td>
          ) : (
            <td className="py-2 px-4">
              <input type="number" className="border p-1 w-20" placeholder="Enter Value" />
            </td>
          )}
          <td className="py-2 px-4">
            <button className="bg-blue-500 text-white px-2 py-1 rounded">Apply %</button>
          </td>
          <td className="py-2 px-4">
            <button className="bg-green-500 text-white px-2 py-1 rounded">Apply Value</button>
          </td>
          <td className="py-2 px-4">0%</td>
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
        <tbody>{renderRows(initialData)}</tbody>
      </table>
    </div>
  );
};

export default Table;
