import './App.css';
import React, { useState } from 'react';


function ShoppingList({ shoppingList, removeItem, budget }) {
    const totalSpent = shoppingList.reduce((acc, item) => acc + Number(item.cost), 0);
    const remainingBudget = budget - totalSpent;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Remaining Budget: <span className={remainingBudget < 0 ? "text-red-500" : "text-green-500"}>${remainingBudget.toFixed(2)}</span>
            </h2>
            <div className="space-y-4">
                {shoppingList.map((val, index) => (
                    <div
                        className={`p-4 rounded-lg shadow-md bg-white border ${
                            val.purchased ? 'border-green-500 bg-green-50' : 'border-gray-200'
                        }`}
                        key={index}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">{val.name}</h3>
                            <span className="text-sm font-medium text-white bg-blue-500 px-2 py-1 rounded-full">
                                {val.category}
                            </span>
                        </div>
                        <div className="text-gray-600 mb-4">
                            <p>
                                <strong>Cost:</strong> ${val.cost.toFixed(2)}
                            </p>
                            <p>
                                <strong>Due Date:</strong> {val.dueDate}
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                onClick={() => removeItem(val.name)}
                            >
                                Mark as Purchased
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                onClick={removeItem}
                                value={val.name}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ShoppingList;