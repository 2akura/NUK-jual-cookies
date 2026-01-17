// 1️⃣ Intercept main submit button
document.querySelector('.submit').addEventListener('click', function(event){
  event.preventDefault(); // block default submit
  showSummaryModal();
});

// 2️⃣ Show modal summary and calculate total
function showSummaryModal(){
  const toppings = document.querySelectorAll('.feature-checkbox');
  const summaryList = document.getElementById('modal-summary-list');
  summaryList.innerHTML = '';
  let total = 0;
  const orderItems = [];

  toppings.forEach(t => {
    const qtyInput = document.getElementById(t.id + '_qty'); // must match your HTML IDs
    if(t.checked){
      const qty = parseInt(qtyInput.value);
      if(!qty || qty <= 0){
        alert(`Please enter a valid amount for ${t.id.replace('_',' ')}`);
        return;
      }
      const item = JSON.parse(t.value);
      const itemTotal = item.price * qty;
      total += itemTotal;
      orderItems.push({
        name: item.name,
        unitPrice: item.price,
        quantity: qty,
        totalPrice: itemTotal
      });
      summaryList.innerHTML += `<li>${item.name} x ${qty} = RM${itemTotal.toFixed(2)}</li>`;
    }
  });

  document.getElementById('modal-total-price').innerText = total.toFixed(2);
  document.getElementById('modal-summary').style.display = 'flex';
}

// 3️⃣ Close modal
document.querySelector('.close-btn').addEventListener('click', () => {
  document.getElementById('modal-summary').style.display = 'none';
  document.getElementById('qr-container').innerHTML = ''; // clear previous QR
});

// 4️⃣ Confirm modal: PDF + QR + submit
document.getElementById('confirm-submit').addEventListener('click', () => {
  const receiptFile = document.getElementById('receipt').files[0];
  if(!receiptFile){
    alert("Please upload your PDF receipt to proceed.");
    return; // BLOCK submission
  }

  // 4a. Display your provided QR code
  const qrContainer = document.getElementById('qr-container');
  qrContainer.innerHTML = `<img src="YOUR_QR_CODE_URL_HERE" alt="QR Code" />`;

  // 4b. Read PDF as Base64
  const reader = new FileReader();
  reader.onload = function(e){
    const pdfBase64 = e.target.result;

    // 4c. Prepare toppings data
    const toppingsData = Array.from(document.querySelectorAll('.feature-checkbox:checked')).map(t => {
      const qty = parseInt(document.getElementById(t.id + '_qty').value);
      return { value: t.value, quantity: qty };
    });

    // 4d. Call Apps Script (optional) and submit
    google.script.run
      .withSuccessHandler(() => {
        document.querySelector('form').submit(); // finally submit
      })
      .processForm({
        items: toppingsData,
        pdfBase64: pdfBase64,
        pdfFilename: receiptFile.name
      });
  };
  reader.readAsDataURL(receiptFile);
});
