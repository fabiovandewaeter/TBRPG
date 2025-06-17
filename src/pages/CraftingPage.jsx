import React, { useState } from 'react';
import { forgeCrafts } from '../data/crafts/forgeCrafts';
import { categories } from '../data/crafts/craftingCategories';

export default function CraftingPage() {
    const [activeTab, setActiveTab] = useState(categories[0].id);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Crafting</h1>

            <div className="border-b mb-4">
                <nav className="flex -mb-px">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`px-4 py-2 -mb-px border-b-2 font-medium focus:outline-none ${activeTab === cat.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => setActiveTab(cat.id)}
                        >
                            {cat.displayName}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="tab-content">
                {activeTab === 'forge' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Forge Recipes</h2>
                        <ul>
                            {Object.entries(forgeCrafts).map(craft => (
                                <li key={craft[0]}>{craft[1].displayName}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {activeTab === 'cooking' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Cooking Recipes</h2>
                        {/* Render your cooking crafting list here */}
                    </div>
                )}

                {activeTab === 'archery' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Archery Crafting</h2>
                        {/* Render your archery crafting list here */}
                    </div>
                )}

                {activeTab === 'alchemy' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Alchemy Potions</h2>
                        {/* Render your alchemy crafting list here */}
                    </div>
                )}
            </div>
        </div>
    );
}
