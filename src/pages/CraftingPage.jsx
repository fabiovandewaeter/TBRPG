import React, { useState } from 'react';
import { forgeCrafts } from '../data/crafts/forgeCrafts';
import { craftingCategories } from '../data/crafts/craftingCategories';
import RecipeList from '../components/RecipeList';
import { cookingCrafts } from '../data/crafts/cookingCrafts';
import { archeryCrafts } from '../data/crafts/archeryCrafts';
import { alchemyCrafts } from '../data/crafts/alchemyCrafts';
import { tailoringCrafts } from '../data/crafts/tailoringCrafts';
import { jewelryCrafts } from '../data/crafts/jewelryCrafts';

export default function CraftingPage() {
    const [activeTab, setActiveTab] = useState(craftingCategories[0].id);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Crafting</h1>

            <div className="border-b mb-4">
                <nav className="flex -mb-px">
                    {craftingCategories.map(cat => (
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
                {activeTab === "forge" && (
                    <RecipeList category="forge" craftList={forgeCrafts} />
                )}

                {activeTab === "cooking" && (
                    <RecipeList category="cooking" craftList={cookingCrafts} />
                )}

                {activeTab === "archery" && (
                    <RecipeList category="archery" craftList={archeryCrafts} />
                )}

                {activeTab === "alchemy" && (
                    <RecipeList category="alchemy" craftList={alchemyCrafts} />
                )}

                {activeTab === "tailoring" && (
                    <RecipeList category="tailoring" craftList={tailoringCrafts} />
                )}

                {activeTab === "jewelry" && (
                    <RecipeList category="jewelry" craftList={jewelryCrafts} />
                )}
            </div>
        </div>
    );
}
