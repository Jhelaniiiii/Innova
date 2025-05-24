<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*" %>
<%@ page import="java.util.*" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="java.util.Date" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Current Jobs | JetBlue Transport</title>
    <link rel="stylesheet" href="css/current_jobs.css">
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
                <div class="logo-container">
                   
                    <span class="company-name">JetBlue Transport</span>
                </div>
                <!-- Close button for mobile -->
                <button class="close-sidebar" id="closeSidebar">
                    <span class="material-icons">close</span>
                </button>
            </div>
            
              <!-- new -->
           <nav class="nav-menu">
    <a href="appointments.jsp" class="nav-button ">
        <span class="material-icons">event</span>
        Appointments
    </a>
    <a href="users.jsp" class="nav-button">
        <span class="material-icons">people</span>
        Users
    </a>
    <a href="current_jobs.jsp" class="nav-button active">
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
                <h1>Current Jobs</h1>
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
                <div class="current_jobs-list" id="current_jobsList">
                    <%
                    // Database connection parameters
                    String jdbcURL = "jdbc:mysql://localhost:3306/jetBlueTransport";
                    String dbUser = "root"; // Replace with your database username
                    String dbPassword = "SAVAGEGOD20:)"; // Replace with your database password
                    
                    Connection conn = null;
                    PreparedStatement pstmt = null;
                    ResultSet rs = null;
                    
                    try {
                        // Load the JDBC driver
                        Class.forName("com.mysql.jdbc.Driver");
                        
                        // Establish connection
                        conn = DriverManager.getConnection(jdbcURL, dbUser, dbPassword);
                        
                        // Prepare SQL query to fetch current jobs
                        String sql = "SELECT j.id, c.name, j.pickup_address, j.delivery_address, " +
                                    "j.pickup_info, j.delivery_info, j.job_date, j.job_time, j.status " +
                                    "FROM current_jobs j " +
                                    "JOIN customers c ON j.customer_id = c.id " +
                                    "WHERE j.status = 'Pending' " +
                                    "ORDER BY j.job_date, j.job_time";
                        
                        pstmt = conn.prepareStatement(sql);
                        rs = pstmt.executeQuery();
                        
                        // Format date for display
                        SimpleDateFormat dateFormat = new SimpleDateFormat("EEEE d'%s' MMM, yyyy");
                        SimpleDateFormat timeFormat = new SimpleDateFormat("h a");
                        
                        // Counter for jobs
                        int currentJobCount = 0;
                        
                        // Loop through results and generate job cards
                        while(rs.next()) {
                            currentJobCount++;
                            
                            // Get job details
                            int currentJobId = rs.getInt("id");
                            String customerName = rs.getString("name");
                            String pickupAddress = rs.getString("pickup_address");
                            String deliveryAddress = rs.getString("delivery_address");
                            String pickupInfo = rs.getString("pickup_info");
                            String deliveryInfo = rs.getString("delivery_info");
                            Date jobDate = rs.getDate("job_date");
                            Time jobTime = rs.getTime("job_time");
                            String status = rs.getString("status");
                            
                            // Format the date with proper suffix (st, nd, rd, th)
                            String day = String.valueOf(jobDate.getDate());
                            String suffix = "th";
                            if (day.endsWith("1") && !day.endsWith("11")) suffix = "st";
                            else if (day.endsWith("2") && !day.endsWith("12")) suffix = "nd";
                            else if (day.endsWith("3") && !day.endsWith("13")) suffix = "rd";
                            
                            String formattedDate = String.format(dateFormat.format(jobDate), suffix);
                            String formattedTime = timeFormat.format(jobTime);
                    %>
                    <div class="current_job-card">
                        <h2><%= customerName %></h2>
                        <p class="address"><%= pickupAddress %> TO <%= deliveryAddress %></p>
                        <div class="specifications">
                            <p><strong>Spec. info 1:</strong> <%= pickupInfo != null && !pickupInfo.isEmpty() ? pickupInfo : "N/A" %></p>
                            <p><strong>Spec. info 2:</strong> <%= deliveryInfo != null && !deliveryInfo.isEmpty() ? deliveryInfo : "N/A" %></p>
                        </div>
                        <p class="datetime"><%= formattedDate %></p>
                        <p class="time"><%= formattedTime %></p>
                        <div class="status-wrapper">
                            <span class="status-label">Status:</span>
                            <span class="status-badge pending"><%= status %></span>
                        </div>
                    </div>
                    <%
                        }
                        
                        // If no jobs found, display a message
                        if (currentJobCount == 0) {
                    %>
                    <div class="no-current_jobs-message">
                        <p>No current jobs found.</p>
                    </div>
                    <%
                        }
                    } catch(Exception e) {
                        out.println("<div class='error-message'>Error: " + e.getMessage() + "</div>");
                        e.printStackTrace();
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
                </div>
                
                <!-- No results message -->
                <div class="no-results" id="noResults">
                    <span class="material-icons">search_off</span>
                    <p>No current jobs found</p>
                </div>
                
                <!-- Pagination -->
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
            </div>
        </main>
        
        <!-- Overlay for mobile sidebar -->
        <div class="overlay" id="overlay"></div>
    </div>
    <script src="current_jobs.js"></script>
</body>
</html>