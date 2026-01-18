document.querySelector('.submit').addEventListener('click', function (event) {
  event.preventDefault();

  if (!validateBasicInfo()) {
    return; // BLOCK everything
  }

  showSummaryModal();
});


function validateBasicInfo() {
  var name = document.getElementById('name').value;
  var address = document.getElementById('address').value;

  if (name === '' || address === '') {
    alert('Please fill in your name and address.');
    return false;
  }
  return true;
}

function showSummaryModal() {
  var toppings = document.querySelectorAll('.feature-checkbox');
  var summaryList = document.getElementById('modal-summary-list');
  summaryList.innerHTML = '';

  var total = 0;

  for (var i = 0; i < toppings.length; i++) {
    var t = toppings[i];

    if (t.checked) {
      var qtyInput = document.getElementById(t.id + '_qty');
      var qty = parseInt(qtyInput.value, 10);

      if (!qty || qty <= 0) {
        alert('Please enter a valid amount for ' + t.id.replace('_', ' '));
        return;
      }

      var item = JSON.parse(t.value);
      var itemTotal = item.price * qty;
      total += itemTotal;

      summaryList.innerHTML +=
        '<li>' +
        item.name +
        ' x ' +
        qty +
        ' = RM' +
        itemTotal.toFixed(2) +
        '</li>';
    }
  }

  document.getElementById('modal-total-price').innerHTML = total.toFixed(2);
  document.getElementById('modal-summary').style.display = 'flex';
}

document.querySelector('.close-btn').addEventListener('click', function () {
  document.getElementById('modal-summary').style.display = 'none';
  document.getElementById('qr-container').innerHTML = '';
});

document.getElementById('confirm-submit').addEventListener('click', function () {
  var receiptInput = document.getElementById('receipt');
  var receiptFile = receiptInput.files[0];

  if (!receiptFile) {
    alert('Please upload your PDF receipt to proceed.');
    return;
  }

  if (receiptFile.type !== 'application/pdf') {
    alert('Only PDF files are allowed.');
    receiptInput.value = '';
    return;
  }

  // Show QR
  var qrContainer = document.getElementById('qr-container');
  qrContainer.innerHTML =
    '<img src="YOUR_QR_CODE_URL_HERE" alt="QR Code" />';

  // Read PDF
  var reader = new FileReader();
  reader.onload = function () {
    // At this point PDF exists → allow submit
    document.querySelector('form').submit();
  };

  reader.readAsDataURL(receiptFile);
});
