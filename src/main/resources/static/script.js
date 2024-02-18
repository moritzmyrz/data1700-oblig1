document.addEventListener('DOMContentLoaded', function () {
	var tickets = [];

	// Function to add a ticket
	function addTicket(movie, amount, firstName, lastName, phone, email) {
		tickets.push({ movie, amount, firstName, lastName, phone, email });
		updateTicketList();
		clearFields();
	}

	// Function to update the list of tickets
	function updateTicketList() {
		var tbody = document.getElementById('tabellinnhold');
		tbody.innerHTML = '';
		tickets.forEach(function (ticket) {
			var tr = document.createElement('tr');
			tr.innerHTML =
				'<td>' +
				ticket.movie +
				'</td>' +
				'<td>' +
				ticket.amount +
				'</td>' +
				'<td>' +
				ticket.firstName +
				'</td>' +
				'<td>' +
				ticket.lastName +
				'</td>' +
				'<td>' +
				ticket.phone +
				'</td>' +
				'<td>' +
				ticket.email +
				'</td>';
			tbody.appendChild(tr);
		});
	}

	// Function to clear input fields
	function clearFields() {
		document.getElementById('movie').value = '';
		document.getElementById('amount').value = '';
		document.getElementById('fornavn').value = '';
		document.getElementById('etternavn').value = '';
		document.getElementById('tlf').value = '';
		document.getElementById('e-post').value = '';
	}

	// Function to validate email
	function validateEmail(email) {
		var re = /\S+@\S+\.\S+/;
		var emailErrorSpan = document.getElementById('e-post_error');
		if (re.test(email)) {
			emailErrorSpan.textContent = '';
			return true;
		} else {
			emailErrorSpan.textContent = 'Ugyldig e-postadresse';
			return false;
		}
	}

	// Function to validate phone number
	function validatePhone(phone) {
		var re = /^\d{8}$/;
		var phoneErrorSpan = document.getElementById('tlf_error');
		if (re.test(phone)) {
			phoneErrorSpan.textContent = '';
			return true;
		} else {
			phoneErrorSpan.textContent = 'Ugyldig telefonnummer';
			return false;
		}
	}

	// Click event for adding a ticket
	document.getElementById('kjopBillett').addEventListener('click', function () {
		var movie = document.getElementById('movie').value;
		var amount = document.getElementById('amount').value;
		var firstName = document.getElementById('fornavn').value;
		var lastName = document.getElementById('etternavn').value;
		var phone = document.getElementById('tlf').value;
		var email = document.getElementById('e-post').value;

		// Validate fields
		var validEmail = validateEmail(email);
		var validPhone = validatePhone(phone);
		if (
			!movie ||
			!amount ||
			!firstName ||
			!lastName ||
			!validEmail ||
			!validPhone
		) {
			return;
		}

		addTicket(movie, amount, firstName, lastName, phone, email);
	});

	// Click event for deleting all tickets
	document.getElementById('slettAlle').addEventListener('click', function () {
		tickets = [];
		updateTicketList();
	});
});
