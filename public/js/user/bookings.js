document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user || user.role !== 'user') {
        window.location.href = '/index.html';
        return;
    }

    // Load bookings
    loadBookings();

    // Logout handler
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    });
});

async function loadBookings() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/bookings/my-bookings', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const bookings = await response.json();
        displayBookings(bookings);
    } catch (error) {
        console.error('Error loading bookings:', error);
        document.getElementById('bookingsList').innerHTML = '<p>Error loading bookings</p>';
    }
}

function displayBookings(bookings) {
    if (bookings.length === 0) {
        document.getElementById('bookingsList').innerHTML = '<p>No bookings found</p>';
        return;
    }

    const bookingsHtml = bookings.map(booking => {
        const movieTitle = booking.movie ? booking.movie.title : 'Unknown Movie';
        const theaterName = booking.theater ? booking.theater.name : 'Unknown Theater';
        const theaterLocation = booking.theater ? booking.theater.location : 'Unknown Location';
        const showTime = booking.showTime || 'N/A';
        const seats = booking.seats && Array.isArray(booking.seats)
            ? booking.seats.map(seat => seat.seatNumber).join(', ')
            : 'N/A';
        const totalAmount = booking.totalAmount || 'N/A';
        const status = booking.status || 'N/A';
        const bookingDate = booking.bookingDate
            ? new Date(booking.bookingDate).toLocaleString()
            : 'N/A';

        return `
            <div class="booking-item">
                <div class="movie-info">
                    <h3>${movieTitle}</h3>
                    <p><strong>Theater:</strong> ${theaterName} - ${theaterLocation}</p>
                    <p><strong>Show Time:</strong> ${showTime}</p>
                    <p><strong>Seats:</strong> ${seats}</p>
                    <p><strong>Total Amount:</strong> $${totalAmount}</p>
                    <p><strong>Status:</strong> <span class="status ${status}">${status}</span></p>
                    <p><strong>Booking Date:</strong> ${bookingDate}</p>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('bookingsList').innerHTML = bookingsHtml;
}

const applyFilters = async () => {
    const search = searchInput.value;
    const genre = genreFilter.value;
    const location = locationFilter.value;

    console.log('Applying filters:', { search, genre, location });

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/movies?search=${search}&genre=${genre}&location=${location}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const movies = await response.json();
        displayMovies(movies);
    } catch (error) {
        console.error('Error applying filters:', error);
    }
}; 