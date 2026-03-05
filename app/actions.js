'use server'
import pool from '../lib/db'; 
import { revalidatePath } from 'next/cache';

// 1. Naya Product Add karne ke liye
export async function addProduct(formData) {
    const name = formData.get('name');
    const price = formData.get('price');
    const stock = formData.get('stock');

    await pool.query(
        'INSERT INTO products (name, price, stock) VALUES ($1, $2, $3)',
        [name, price, stock]
    );
    revalidatePath('/');
}

// 2. Product Delete karne ke liye
export async function deleteProduct(id) {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    revalidatePath('/');
}

// 3. Product Edit/Update karne ke liye (Ye naya wala yahan add karein)
export async function updateProduct(formData) {
    const id = formData.get('id'); // Hidden input se ID pakre ga
    const name = formData.get('name');
    const price = formData.get('price');
    const stock = formData.get('stock');

    await pool.query(
        'UPDATE products SET name = $1, price = $2, stock = $3 WHERE id = $4',
        [name, price, stock, id]
    );
    revalidatePath('/');
}