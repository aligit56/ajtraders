export const generateWhatsAppLink = (order, userDetails) => {
    const storePhone = "923001234567"; // AJTraders WhatsApp Number (without +)
    
    let message = `*NEW ORDER - AJTraders* 🛒\n\n`;
    message += `*Customer:* ${userDetails.name}\n`;
    message += `*Phone:* ${userDetails.phone}\n`;
    message += `*Address:* ${userDetails.address}\n\n`;
    message += `*ITEMS:*\n`;
    
    order.items.forEach((item, index) => {
        message += `${index + 1}. ${item.name} (x${item.quantity}) - Rs ${item.price * item.quantity}\n`;
    });
    
    message += `\n*TOTAL: Rs ${order.total_price}*\n`;
    if(userDetails.notes) message += `\n*Notes:* ${userDetails.notes}`;
    
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${storePhone}?text=${encodedMessage}`;
};
