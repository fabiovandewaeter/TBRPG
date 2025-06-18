import React, { useState } from 'react';
import * as recipeModules from '../data/recipes';
import RecipeList from '../components/RecipeList';
import { craftingCategories } from '../data/recipes/craftingCategories';

export default function CraftingPage() {
    const [activeTab, setActiveTab] = useState(craftingCategories[0].id);

    // get the right recipeList from src/data/recipes folder
    const { recipesKey } = craftingCategories.find(c => c.id === activeTab);
    const recipeList = recipeModules[recipesKey];

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Crafting</h1>

            <nav className="flex border-b mb-4">
                {craftingCategories.map(cat => (
                    <button
                        key={cat.id}
                        className={`
              px-4 py-2 -mb-px border-b-2 font-medium focus:outline-none
              ${activeTab === cat.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'}
            `}
                        onClick={() => setActiveTab(cat.id)}
                    >
                        {cat.displayName}
                    </button>
                ))}
            </nav>

            <RecipeList recipeList={recipeList} />
        </div>
    );
}
