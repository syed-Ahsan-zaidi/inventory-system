import pool from '../lib/db';
import { addProduct, deleteProduct, updateProduct } from './actions';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; edit?: string }> | { query?: string; edit?: string };
}) {
  const params = await searchParams;
  const searchTerm = params.query || '';
  const editId = params.edit || ''; // URL se edit ID pakarna (?edit=ID)

  // 1. Database se data mangwana (Filtered)
  const res = await pool.query(
    'SELECT * FROM products WHERE name ILIKE $1 ORDER BY id DESC',
    [`%${searchTerm}%`]
  );
  const products = res.rows;

  // 2. Agar koi product edit ho raha hai, to uski details nikalna
  const productToEdit = editId 
    ? products.find((p: any) => p.id === parseInt(editId)) 
    : null;

  return (
    <main className="p-10 max-w-4xl mx-auto text-black">
      <h1 className="text-3xl font-bold mb-8 text-center">📦 Inventory System</h1>

      {/* --- SEARCH BAR --- */}
      <div className="mb-6">
        <form method="GET" action="/" className="flex gap-2">
          <input
            name="query"
            type="text"
            defaultValue={searchTerm}
            placeholder="Search products..."
            className="border p-2 rounded flex-1 text-black shadow-sm"
          />
          <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black">
            Search
          </button>
          {searchTerm && <a href="/" className="p-2 text-sm text-blue-500 self-center">Clear</a>}
        </form>
      </div>

      {/* --- DYNAMIC FORM (Add aur Edit dono ke liye) --- */}
      <section className={`mb-10 p-6 rounded-lg shadow-md border-2 ${productToEdit ? 'border-orange-400 bg-orange-50' : 'border-blue-400 bg-blue-50'}`}>
        <h2 className="text-lg font-bold mb-4">
            {productToEdit ? "📝 Edit Product" : "➕ Add New Product"}
        </h2>
        
        <form action={productToEdit ? updateProduct : addProduct} className="flex gap-4">
          {/* Hidden ID sirf update ke waqt zaroori hai */}
          {productToEdit && <input type="hidden" name="id" value={productToEdit.id} />}
          
          <input 
            name="name" 
            key={`name-${productToEdit?.id}`}
            defaultValue={productToEdit?.name || ""} 
            placeholder="Name" 
            className="border p-2 rounded flex-1 text-black" 
            required 
          />
          <input 
            name="price" 
            type="number" 
            key={`price-${productToEdit?.id}`}
            defaultValue={productToEdit?.price || ""} 
            placeholder="Price" 
            className="border p-2 rounded w-32 text-black" 
            required 
          />
          <input 
            name="stock" 
            type="number" 
            key={`stock-${productToEdit?.id}`}
            defaultValue={productToEdit?.stock || ""} 
            placeholder="Stock" 
            className="border p-2 rounded w-32 text-black" 
            required 
          />
          
          <button type="submit" className={`px-6 py-2 rounded text-white font-bold shadow ${productToEdit ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {productToEdit ? "Update" : "Add"}
          </button>

          {productToEdit && (
            <a href="/" className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</a>
          )}
        </form>
      </section>

      {/* --- PRODUCT TABLE --- */}
      <table className="w-full border-collapse border border-gray-300 shadow-sm bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-3 border text-left">Name</th>
            <th className="p-3 border text-left">Price</th>
            <th className="p-3 border text-left">Stock</th>
            <th className="p-3 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((p: any) => (
              <tr key={p.id} className={`border-b hover:bg-gray-50 ${editId == p.id ? 'bg-yellow-100' : ''}`}>
                <td className="p-3 border font-medium">{p.name}</td>
                <td className="p-3 border text-green-700 font-semibold">${p.price}</td>
                <td className="p-3 border">{p.stock}</td>
                <td className="p-3 border text-center flex justify-center gap-4">
                  
                  {/* EDIT Button (Sirf URL update karega) */}
                  <a href={`?edit=${p.id}`} className="text-blue-600 font-bold hover:underline">Edit</a>
                  
                  {/* DELETE Button */}
                  <form action={deleteProduct.bind(null, p.id)}>
                    <button className="text-red-500 font-bold hover:underline">Delete</button>
                  </form>
                  
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-10 text-center text-gray-500 italic">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}