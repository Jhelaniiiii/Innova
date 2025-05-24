<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*" %>
<%@ page import="java.util.*" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="JetBlue.ConnectionProvider" %>

<%
// Database connection parameters
String jdbcURL = "jdbc:mysql://localhost:3306/jetBlueTransport";
String dbUser = "root";
String dbPassword = "SAVAGEGOD20:)";

Connection conn = null;
PreparedStatement pstmt = null;
ResultSet rs = null;
List<Map<String, String>> appointments = new ArrayList<>();

try {
    // Load the JDBC driver
    Class.forName("com.mysql.jdbc.Driver");
    
    // Establish connection
    conn = DriverManager.getConnection(jdbcURL, dbUser, dbPassword);
    
    // Prepare SQL statement to fetch appointments
    String sql = "SELECT b.id, b.booking_date, b.booking_time, b.from_location, b.to_location, " +
                 "b.specific_info1, b.specific_info2, c.name " +
                 "FROM bookings b " +
                 "JOIN customers c ON b.customer_id = c.id " +
                 "ORDER BY b.booking_date, b.booking_time";
    
    pstmt = conn.prepareStatement(sql);
    rs = pstmt.executeQuery();
    
    // Format date for display
    SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd");
    SimpleDateFormat outputFormat = new SimpleDateFormat("EEEE d'%s' MMM, yyyy");
    
    // Process results
    while (rs.next()) {
        Map<String, String> appointment = new HashMap<>();
        
        // Get data from result set
        appointment.put("id", rs.getString("id"));
        appointment.put("customerName", rs.getString("name"));
        appointment.put("fromLocation", rs.getString("from_location"));
        appointment.put("toLocation", rs.getString("to_location"));
        appointment.put("specificInfo1", rs.getString("specific_info1"));
        appointment.put("specificInfo2", rs.getString("specific_info2"));
        
        // Format the date
        String rawDate = rs.getString("booking_date");
        if (rawDate != null) {
            java.util.Date date = inputFormat.parse(rawDate);
            int day = Integer.parseInt(new SimpleDateFormat("d").format(date));
            String suffix;
            
            if (day >= 11 && day <= 13) {
                suffix = "th";
            } else {
                switch (day % 10) {
                    case 1: suffix = "st"; break;
                    case 2: suffix = "nd"; break;
                    case 3: suffix = "rd"; break;
                    default: suffix = "th"; break;
                }
            }
            
            String formattedDate = String.format(outputFormat.format(date), suffix);
            appointment.put("date", formattedDate);
        } else {
            appointment.put("date", "Not specified");
        }
        
        // Format the time
        String time = rs.getString("booking_time");
        if (time != null) {
            appointment.put("time", time);
        } else {
            appointment.put("time", "Not specified");
        }
        
        // Add to appointments list
        appointments.add(appointment);
    }
    
} catch (Exception e) {
    e.printStackTrace();
    // Set error attribute
    request.setAttribute("error", "Error: " + e.getMessage());
} finally {
    // Close resources
    try {
        if (rs != null) rs.close();
        if (pstmt != null) pstmt.close();
        if (conn != null) conn.close();
    } catch (SQLException e) {
        e.printStackTrace();
    }
}
%>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Appointments | JetBlue Transport</title>
    <link rel="stylesheet" href="css/appointments.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
    <div class="dashboard-container">
        <!-- Mobile menu toggle button -->
        <button class="mobile-menu-toggle" id="mobileMenuToggle">
            <span class="material-icons">menu</span>
        </button>
        
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
             <!-- new -->
                <div class="logo-container">
                    <span class="company-name">JetBlue Transport</span>
                </div>
                 <!-- new -->
                <!-- Close button for mobile -->
                <button class="close-sidebar" id="closeSidebar">
                    <span class="material-icons">close</span>
                </button>
            </div>
           <!-- new -->
           <nav class="nav-menu">
    <a href="appointments.jsp" class="nav-button active">
        <span class="material-icons">event</span>
        Appointments
    </a>
    <a href="users.jsp" class="nav-button">
        <span class="material-icons">people</span>
        Users
    </a>
    <a href="current_jobs.jsp" class="nav-button">
        <span class="material-icons">work</span>
        Current Jobs
    </a>
    <a href="past-jobs.jsp" class="nav-button">
        <span class="material-icons">history</span>
        Past Jobs
    </a>
    <a href="quotes.jsp" class="nav-button">
        <span class="material-icons">request_quote</span>
        Quotes
    </a>
</nav>
<!-- new -->
        </aside>

        <main class="main-content">
            <header class="top-header">
                <h1>Appointments</h1>
                <button class="logout-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span class="logout-text">Log Out</span>
                </button>
            </header>

            <!-- Search bar --> 
            <div class="search-bar-search">
                <input type="text" id="searchInput" placeholder="Type to search...">
                <svg xmlns="http://www.w3.org/2000/svg" class="search-icon-search" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
            </div>

            <div class="content-wrapper">
                <div class="appointments-list" id="appointmentsList">
                    <% if (appointments.isEmpty()) { %>
                        <div class="no-results" id="noResults" style="display: flex;">
                            <span class="material-icons">search_off</span>
                            <p>No appointments found</p>
                        </div>
                    <% } else { 
                        for (Map<String, String> appointment : appointments) { %>
                            <div class="appointment-card">
                                <h2><%= appointment.get("customerName") %> - Transport</h2>
                                <p class="address"><%= appointment.get("fromLocation") %> TO <%= appointment.get("toLocation") %></p>
                                <div class="specifications">
                                    <p><strong>Spec. info 1:</strong> <%= appointment.get("specificInfo1") != null ? appointment.get("specificInfo1") : "N/A" %></p>
                                    <p><strong>Spec. info 2:</strong> <%= appointment.get("specificInfo2") != null ? appointment.get("specificInfo2") : "N/A" %></p>
                                </div>
                                <p class="datetime"><%= appointment.get("date") %></p>
                                <p class="time"><%= appointment.get("time") %></p>
                            </div>
                        <% } 
                    } %>
                </div>
                
                <!-- No results message for search -->
                <div class="no-results" id="noResults" style="display: none;">
                    <span class="material-icons">search_off</span>
                    <p>No appointments found</p>
                </div>
                
                <!-- Pagination -->
                <% if (!appointments.isEmpty()) { %>
                    <div class="pagination" id="pagination">
                        <button class="pagination-btn" id="prevBtn"><i class="material-icons">chevron_left</i></button>
                        <div class="page-numbers">
                            <button class="pagination-btn active">1</button>
                            <button class="pagination-btn">2</button>
                            <button class="pagination-btn">3</button>
                            <button class="pagination-btn">4</button>
                            <span class="ellipsis">...</span>
                            <button class="pagination-btn">9</button>
                        </div>
                        <button class="pagination-btn" id="nextBtn"><i class="material-icons">chevron_right</i></button>
                    </div>
                <% } %>
            </div>
        </main>
        
        <!-- Overlay for mobile sidebar -->
        <div class="overlay" id="overlay"></div>
    </div>
    <script src="appointments.js"></script>
</body>
</html>