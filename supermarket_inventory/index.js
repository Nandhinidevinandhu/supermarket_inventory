// Define the CRUD-CRUD API URL
const apiUrl = 'https://crudcrud.com/api/93065f0e97b64f9093fe7d67d787a893/items';

// Function to fetch inventory items from the server
async function fetchInventory() {
    try {
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching inventory:', error);
    }
}

// Function to update item quantity after purchase
async function updateItem(itemId, newQuantity) {
    try {
        const response = await axios.put(`${apiUrl}/${itemId}`, { quantity: newQuantity });
        console.log('Item updated:', response.data);
        // Refresh inventory after updating
        displayInventory();
    } catch (error) {
        console.error('Error updating item:', error);
    }
}

// Function to display inventory on the webpage
async function displayInventory() {
    const inventoryList = document.getElementById('inventory-list');
    inventoryList.innerHTML = '';

    const inventory = await fetchInventory();

    if (inventory) {
        inventory.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.itemname}</td>
                <td>${item.description}</td>
                <td>$${item.price}</td>
                <td>${item.quantity}</td>
                <td><button onclick="buyItem('${item._id}', ${item.quantity})">Buy</button></td>
            `;
            inventoryList.appendChild(row);
        });
    }
}

// Function to handle buying an item
function buyItem(itemId, currentQuantity) {
    const buyQuantity = parseInt(prompt('Enter quantity to buy:', '1'));
    if (buyQuantity && buyQuantity > 0 && buyQuantity <= currentQuantity) {
        const newQuantity = currentQuantity - buyQuantity;
        updateItem(itemId, newQuantity);
    } else {
        alert('Invalid quantity or not enough stock.');
    }
}

// Function to add a new item to the inventory
async function addItem(itemData) {
    try {
        const response = await axios.post(apiUrl, itemData);
        console.log('Item added:', response.data);
        displayInventory();
    } catch (error) {
        console.error('Error adding item:', error);
    }
}

// Event listener for form submission to add a new item
document.getElementById('add-item-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const itemName = document.getElementById('item-name').value;
    const description = document.getElementById('description').value;
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    addItem({ itemname: itemName, description, price, quantity });
});

// Initial display of inventory when the page loads
displayInventory();
