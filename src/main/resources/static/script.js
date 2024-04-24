document.addEventListener('DOMContentLoaded', function () {
	// Function to update the list of tickets
	async function updateTicketList() {
		var tickets = await getTickets();
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

	updateTicketList();

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
	// Function to validate first name
	function validateFirstName(firstName) {
		var firstNameErrorSpan = document.getElementById('fornavn_error');
		if (firstName.trim() !== '') {
			firstNameErrorSpan.textContent = '';
			return true;
		} else {
			firstNameErrorSpan.textContent = 'Fornavn er påkrevd';
			return false;
		}
	}

	// Function to validate last name
	function validateLastName(lastName) {
		var lastNameErrorSpan = document.getElementById('etternavn_error');
		if (lastName.trim() !== '') {
			lastNameErrorSpan.textContent = '';
			return true;
		} else {
			lastNameErrorSpan.textContent = 'Etternavn er påkrevd';
			return false;
		}
	}

	// Function to validate amount
	function validateAmount(amount) {
		var amountErrorSpan = document.getElementById('amount_error');
		if (amount > 0) {
			amountErrorSpan.textContent = '';
			return true;
		} else {
			amountErrorSpan.textContent = 'Antall må være større enn 0';
			return false;
		}
	}
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
	function validateMovie(movie) {
		var movieErrorSpan = document.getElementById('movie_error'); // Add this span in HTML if not present
		if (movie) {
			movieErrorSpan.textContent = '';
			return true;
		} else {
			movieErrorSpan.textContent = 'Velg en film';
			return false;
		}
	}

	// Updated click event handler
	document.getElementById('kjopBillett').addEventListener('click', function () {
		var movie = document.getElementById('movie').value;
		var amount = parseInt(document.getElementById('amount').value);
		var firstName = document.getElementById('fornavn').value;
		var lastName = document.getElementById('etternavn').value;
		var phone = document.getElementById('tlf').value;
		var email = document.getElementById('e-post').value;

		if (
			validateEmail(email) &&
			validatePhone(phone) &&
			validateFirstName(firstName) &&
			validateLastName(lastName) &&
			validateAmount(amount) &&
			validateMovie(movie)
		) {
			var ticket = { movie, amount, firstName, lastName, phone, email };
			addTicketOnServer(ticket)
				.then(() => {
					updateTicketList(); // Now waits for the ticket to be added before updating
					clearFields();
				})
				.catch((error) => {
					console.error('Failed to process ticket:', error);
				});
		}
	});

	// Click event for deleting all tickets
	document.getElementById('slettAlle').addEventListener('click', function () {
		deleteTickets()
			.then(() => {
				updateTicketList();
			})
			.catch((error) => {
				console.error('Error deleting tickets:', error);
			});
	});
});

function addTicketOnServer(ticket) {
	return fetch('http://localhost:8080/tickets', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(ticket),
	})
		.then((response) => {
			if (response.ok) {
				console.log('Ticket added successfully');
				return response.text().then((text) => (text ? JSON.parse(text) : {})); // Handle potential empty responses
			} else {
				console.log('Failed to add ticket');
				throw new Error('Failed to add ticket');
			}
		})
		.catch((error) => {
			console.error('Error:', error);
			throw error; // Ensure it's still caught if there are other issues
		});
}

function getTickets() {
	return fetch('http://localhost:8080/tickets')
		.then((response) => {
			if (response.ok) {
				return response.json(); // Ensure this promise's result is returned
			} else {
				console.log('Failed to get tickets');
				return []; // Return an empty array or appropriate error handling
			}
		})
		.catch((error) => {
			console.error('Error:', error);
			return []; // Return an empty array or throw an error
		});
}

function deleteTickets() {
	return fetch('http://localhost:8080/tickets', {
		method: 'DELETE',
	})
		.then((response) => {
			if (response.ok) {
				console.log('Tickets deleted successfully');
			} else {
				console.log('Failed to delete tickets');
				throw new Error('Failed to delete tickets'); // Ensure an error is thrown if the operation failed
			}
		})
		.catch((error) => {
			console.error('Error:', error);
			throw error; // Re-throw to ensure it can be caught in subsequent chain
		});
}
