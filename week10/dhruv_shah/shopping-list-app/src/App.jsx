import './App.css';
import React, { useState } from 'react';
import ShoppingList from './ShoppingList';

function App() {
    const [shoppingList, setShoppingList] = useState([]);
    const [budget] = useState(100);
    const [filterCategory, setFilterCategory] = useState('All');

    const addItem = (event) => {
        event.preventDefault();
        let form = event.target;
        let formData = new FormData(form);
        let formDataObj = Object.fromEntries(formData.entries());
        formDataObj.purchased = false;
        formDataObj.cost = parseFloat(formDataObj.cost || 0);
        formDataObj.category = formDataObj.category || 'Miscellaneous';
        formDataObj.dueDate = formDataObj.dueDate || new Date().toISOString().split('T')[0];
        setShoppingList([...shoppingList, formDataObj]);
        form.reset();
    };

    const removeItem = (event) => {
        const name = event.target.value;
        setShoppingList(shoppingList.filter(item => item.name !== name));
    };

    const handleFilterChange = (event) => {
        setFilterCategory(event.target.value);
    };

    const filteredShoppingList = filterCategory === 'All'
        ? shoppingList
        : shoppingList.filter(item => item.category === filterCategory);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Shopping List Manager</h1>
            <div className="card bg-white p-6 rounded-lg shadow-md mb-6">
                <form onSubmit={addItem} className="flex flex-wrap gap-4 items-center">
                    <input
                        type="text"
                        name="name"
                        placeholder="Add item to list..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="number"
                        name="cost"
                        placeholder="Cost"
                        className="w-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        name="category"
                        className="w-40 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Groceries">Groceries</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                    </select>
                    <input
                        type="date"
                        name="dueDate"
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                        type="submit"
                    >
                        Add
                    </button>
                </form>
            </div>
            <div className="card bg-white p-6 rounded-lg shadow-md mb-6">
                <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
                    Filter by Category:
                </label>
                <select
                    id="category"
                    name="category"
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="All">All</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                </select>
            </div>
            <ShoppingList
                shoppingList={filteredShoppingList}
                removeItem={removeItem}
                budget={budget}
            />
        </div>
    );
}

export default App;